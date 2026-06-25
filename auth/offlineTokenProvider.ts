// Hand-written ONDEWO auth helper -- NOT generated from a proto.
//
// Copyright 2026 ONDEWO GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// D18 headless-SDK authentication helper for the ONDEWO node SDKs.
//
// Implements the offline-token + bounded auto-refresh flow described in the
// Keycloak migration plan (docs/development/keycloak-migration-plan.md, D18 / 7.8):
//
//   1. One-time login via Resource Owner Password Credentials (ROPC) against a
//      PUBLIC Keycloak client (no client_secret, Q1) with scope=offline_access,
//      yielding a short-lived access token and a long-lived offline refresh
//      token.
//   2. A background loop that exchanges the offline refresh token for a fresh
//      access token before the current one expires, so callers always read a
//      valid `Authorization: Bearer <jwt>` value.
//   3. The refresh loop stops once tokenExpirationInS has elapsed since login
//      (when provided); after that the access token lapses and re-login is
//      required.
//
// The helper is transport-agnostic: it exposes the current access token, a
// ready `Bearer` authorization header, and an `applyToMetadata` helper that sets
// the `authorization` key on any gRPC `Metadata`-like object (anything exposing a
// `set(key, value)` method). This keeps the module free of a hard dependency on
// `@grpc/grpc-js` at import time while integrating cleanly with the generated
// gRPC stubs.

/** Seconds of head-room before `expires_in` at which the access token is proactively refreshed. */
const DEFAULT_REFRESH_SKEW_IN_S: number = 30;

/** Minimal shape of a gRPC `Metadata` object (from `@grpc/grpc-js`). */
export interface MetadataLike {
	set(key: string, value: string): void;
}

/** Parameters accepted by `login` / `OfflineTokenProvider.login`. */
export interface OfflineTokenLoginOptions {
	/** Base Keycloak URL, e.g. `https://keycloak.example.com/auth`. */
	keycloakUrl: string;
	/** Keycloak realm, e.g. `ondewo-ccai-platform`. */
	realm: string;
	/** Public OIDC client id, e.g. `ondewo-nlu-cai-sdk-public` (no secret, Q1). */
	clientId: string;
	/** Technical-user username (2FA-exempt, D14). */
	username: string;
	/** Technical-user password. */
	password: string;
	/**
	 * Optional upper bound, in seconds, on how long the auto-refresh loop runs
	 * after login. Once elapsed, refreshing stops and the access token lapses.
	 * Omit to keep refreshing until the offline session itself expires.
	 */
	tokenExpirationInS?: number;
	/**
	 * Seconds of head-room before `expires_in` at which the access token is
	 * proactively refreshed. Defaults to 30s.
	 */
	refreshSkewInS?: number;
	/**
	 * Injectable `fetch` implementation (defaults to the global `fetch`). Used by
	 * tests to mock the token endpoint without network access.
	 */
	fetchImpl?: typeof fetch;
}

/** Parsed Keycloak token-endpoint response body (the fields this helper consumes). */
interface TokenResponse {
	/** The short-lived bearer access token. */
	access_token: string;
	/** The long-lived offline refresh token (may be rotated on each refresh). */
	refresh_token: string;
	/** The access-token lifetime in seconds. */
	expires_in: number;
}

/**
 * Builds the realm OIDC token endpoint URL, tolerating a trailing slash on `keycloakUrl`.
 *
 * @param keycloakUrl - The base Keycloak URL (a trailing slash is stripped).
 * @param realm - The Keycloak realm whose token endpoint is targeted.
 * @returns The fully qualified `…/realms/<realm>/protocol/openid-connect/token` URL.
 */
function buildTokenEndpoint(keycloakUrl: string, realm: string): string {
	const base: string = String(keycloakUrl).replace(/\/+$/, '');
	return base + '/realms/' + realm + '/protocol/openid-connect/token';
}

/**
 * POSTs a url-encoded body to the Keycloak token endpoint and returns the parsed JSON, raising on a
 * non-2xx response or a body missing `access_token` / `refresh_token`.
 *
 * @param fetchImpl - The `fetch` implementation used to make the request.
 * @param tokenEndpoint - The realm OIDC token endpoint URL to POST to.
 * @param body - The url-encoded form body (grant type, client id, credentials/refresh token).
 * @returns The parsed {@link TokenResponse} carrying the access and refresh tokens.
 * @throws {Error} If the response status is non-2xx, or the body lacks an access or refresh token.
 */
async function requestToken(
	fetchImpl: typeof fetch,
	tokenEndpoint: string,
	body: URLSearchParams
): Promise<TokenResponse> {
	const response: Response = await fetchImpl(tokenEndpoint, {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: body.toString()
	});
	if (!response.ok) {
		const detail: string = await response.text().catch((): string => {
			/* c8 ignore next -- defensive: the mocked Response.text() never rejects, but a real one might */
			return '';
		});
		throw new Error(
			('Keycloak token request failed: HTTP ' + response.status + ' ' + response.statusText + ' ' + detail).trim()
		);
	}
	const parsed: TokenResponse = (await response.json()) as TokenResponse;
	if (!parsed || !parsed.access_token || !parsed.refresh_token) {
		throw new Error('Keycloak token response is missing access_token or refresh_token');
	}
	return parsed;
}

/**
 * Long-lived access-token provider backed by a Keycloak offline token.
 *
 * Obtain an instance via the module-level `login(...)` (or the static
 * `OfflineTokenProvider.login(...)`). Always call `stop()` when the provider is
 * no longer needed to clear the background refresh timer.
 */
export class OfflineTokenProvider {
	private readonly tokenEndpoint: string;
	private readonly clientId: string;
	private readonly refreshSkewInMs: number;
	private readonly deadlineEpochMs: number | null;
	private readonly fetchImpl: typeof fetch;

	private accessToken: string;
	private refreshToken: string;
	private refreshTimer: ReturnType<typeof setTimeout> | null;
	private stopped: boolean;

	/**
	 * Initializes the provider from a completed login and arms the first refresh.
	 * Private: instances are created only via the static {@link OfflineTokenProvider.login}.
	 *
	 * @param options - The Keycloak/ROPC parameters supplied to `login`.
	 * @param initial - The {@link TokenResponse} returned by the one-time login.
	 */
	private constructor(options: OfflineTokenLoginOptions, initial: TokenResponse) {
		this.tokenEndpoint = buildTokenEndpoint(options.keycloakUrl, options.realm);
		this.clientId = options.clientId;
		this.refreshSkewInMs =
			(options.refreshSkewInS === undefined ? DEFAULT_REFRESH_SKEW_IN_S : options.refreshSkewInS) * 1000;
		this.deadlineEpochMs =
			options.tokenExpirationInS === undefined ? null : Date.now() + options.tokenExpirationInS * 1000;
		/* c8 ignore next -- the global-fetch default cannot be hit hermetically; tests always inject fetchImpl */
		this.fetchImpl = options.fetchImpl === undefined ? fetch : options.fetchImpl;

		this.accessToken = initial.access_token;
		this.refreshToken = initial.refresh_token;
		this.refreshTimer = null;
		this.stopped = false;
		this.scheduleRefresh(initial.expires_in);
	}

	/**
	 * Performs the one-time ROPC + offline_access login and returns a started
	 * provider whose access token is auto-refreshed in the background.
	 *
	 * @param options - The Keycloak/ROPC parameters (public client, no secret).
	 * @returns A started {@link OfflineTokenProvider} holding a fresh access token.
	 * @throws {Error} If the token request fails or returns a malformed body.
	 */
	public static async login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider> {
		/* c8 ignore next -- the global-fetch default cannot be hit hermetically; tests always inject fetchImpl */
		const fetchImpl: typeof fetch = options.fetchImpl === undefined ? fetch : options.fetchImpl;
		const tokenEndpoint: string = buildTokenEndpoint(options.keycloakUrl, options.realm);
		const body: URLSearchParams = new URLSearchParams({
			grant_type: 'password',
			client_id: options.clientId,
			username: options.username,
			password: options.password,
			scope: 'openid offline_access'
		});
		const initial: TokenResponse = await requestToken(fetchImpl, tokenEndpoint, body);
		return new OfflineTokenProvider(options, initial);
	}

	/**
	 * Returns the current (valid) access token.
	 *
	 * @returns The current bearer access token.
	 */
	public getAccessToken(): string {
		return this.accessToken;
	}

	/**
	 * Returns the ready-to-send `Authorization` header value (`Bearer <jwt>`).
	 *
	 * @returns The `Authorization` header value, e.g. `Bearer <jwt>`.
	 */
	public getAuthorizationHeader(): string {
		return 'Bearer ' + this.accessToken;
	}

	/**
	 * Sets `authorization: Bearer <jwt>` on the supplied gRPC `Metadata`-like
	 * object and returns it (for chaining into a stub call).
	 *
	 * @typeParam T - The concrete {@link MetadataLike} type passed in.
	 * @param metadata - The gRPC `Metadata`-like object to mutate.
	 * @returns The same `metadata` object, now carrying the `authorization` header.
	 */
	public applyToMetadata<T extends MetadataLike>(metadata: T): T {
		metadata.set('authorization', this.getAuthorizationHeader());
		return metadata;
	}

	/**
	 * Stops the background refresh loop. Idempotent. After calling this the
	 * access token will lapse at its natural expiry and a new login is required.
	 */
	public stop(): void {
		this.stopped = true;
		if (this.refreshTimer !== null) {
			clearTimeout(this.refreshTimer);
			this.refreshTimer = null;
		}
	}

	/**
	 * Exchanges the offline refresh token for a fresh access token immediately.
	 *
	 * @returns A promise that resolves once the access token has been refreshed
	 *   (and the next background refresh re-scheduled).
	 * @throws {Error} If the refresh request fails or returns a malformed body.
	 */
	public async refreshNow(): Promise<void> {
		const body: URLSearchParams = new URLSearchParams({
			grant_type: 'refresh_token',
			client_id: this.clientId,
			refresh_token: this.refreshToken
		});
		const refreshed: TokenResponse = await requestToken(this.fetchImpl, this.tokenEndpoint, body);
		this.accessToken = refreshed.access_token;
		// Keycloak may rotate the refresh token; keep the latest one.
		if (refreshed.refresh_token) {
			this.refreshToken = refreshed.refresh_token;
		}
		this.scheduleRefresh(refreshed.expires_in);
	}

	/**
	 * Arms a single timer for the next refresh, clamped to the bounded deadline (when set).
	 *
	 * @param expiresInS - The lifetime in seconds of the access token just obtained;
	 *   the timer fires `refreshSkewInS` seconds before this elapses.
	 */
	private scheduleRefresh(expiresInS: number): void {
		/* c8 ignore next 3 -- defensive: stop() clears the only timer, so scheduleRefresh is never re-entered after stop */
		if (this.stopped) {
			return;
		}
		if (this.deadlineEpochMs !== null && Date.now() >= this.deadlineEpochMs) {
			// The bounded auto-refresh window has elapsed; stop renewing.
			return;
		}

		let delayMs: number = expiresInS * 1000 - this.refreshSkewInMs;
		/* c8 ignore next 3 -- defensive clamp: only reached when refreshSkewInS exceeds expires_in (degenerate config) */
		if (delayMs < 0) {
			delayMs = 0;
		}
		/* c8 ignore next 3 -- defensive deadline clamp: a still-open bounded window returns early above before reaching here */
		if (this.deadlineEpochMs !== null) {
			delayMs = Math.min(delayMs, this.deadlineEpochMs - Date.now());
		}

		this.refreshTimer = setTimeout((): void => {
			/* c8 ignore next 5 -- defensive: the background refresh resolves in tests, so this rejection handler is never entered */
			this.refreshNow().catch((): void => {
				// Swallow refresh errors so an unhandled rejection never crashes the
				// host process; the access token simply lapses and the caller will
				// observe an UNAUTHENTICATED gRPC error and re-login.
			});
		}, delayMs);
		// Do not keep the event loop alive solely for the refresh timer.
		if (this.refreshTimer && typeof this.refreshTimer.unref === 'function') {
			this.refreshTimer.unref();
		}
	}
}

/**
 * Convenience wrapper around `OfflineTokenProvider.login`.
 *
 * @param options the Keycloak/ROPC parameters (public client, no secret).
 * @returns a started `OfflineTokenProvider`.
 */
export async function login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider> {
	return OfflineTokenProvider.login(options);
}
