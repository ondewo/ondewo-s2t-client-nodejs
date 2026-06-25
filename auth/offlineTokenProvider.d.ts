// Hand-written ONDEWO auth helper typings -- NOT generated from a proto.
//
// D18 headless-SDK authentication helper for the ONDEWO node SDKs.
// See ./offlineTokenProvider.js for the implementation and the migration plan
// (docs/development/keycloak-migration-plan.md, D18 / 7.8) for the design.

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

/**
 * Long-lived access-token provider backed by a Keycloak offline token.
 *
 * Obtain an instance via `login(...)`. Always call `stop()` when the provider is
 * no longer needed to clear the background refresh timer.
 */
export class OfflineTokenProvider {
	private constructor(options: OfflineTokenLoginOptions, initial: unknown);

	/**
	 * Performs the one-time ROPC + `offline_access` login and returns a started
	 * provider whose access token is auto-refreshed in the background.
	 *
	 * @param options - The Keycloak/ROPC parameters (public client, no secret).
	 * @returns A started `OfflineTokenProvider` holding a fresh access token.
	 * @throws {Error} If the token request fails or returns a malformed body.
	 */
	static login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider>;

	/**
	 * Returns the current (valid) access token.
	 *
	 * @returns The current bearer access token.
	 */
	getAccessToken(): string;

	/**
	 * Returns the ready-to-send `Authorization` header value (`Bearer <jwt>`).
	 *
	 * @returns The `Authorization` header value, e.g. `Bearer <jwt>`.
	 */
	getAuthorizationHeader(): string;

	/**
	 * Sets `authorization: Bearer <jwt>` on the supplied gRPC `Metadata`-like
	 * object and returns it (for chaining into a stub call).
	 *
	 * @typeParam T - The concrete `MetadataLike` type passed in.
	 * @param metadata - The gRPC `Metadata`-like object to mutate.
	 * @returns The same `metadata` object, now carrying the `authorization` header.
	 */
	applyToMetadata<T extends MetadataLike>(metadata: T): T;

	/**
	 * Stops the background refresh loop. Idempotent. After calling this the
	 * access token will lapse at its natural expiry and a new `login` is required.
	 */
	stop(): void;

	/**
	 * Exchanges the offline refresh token for a fresh access token immediately.
	 *
	 * @returns A promise that resolves once the access token has been refreshed
	 *   (and the next background refresh re-scheduled).
	 * @throws {Error} If the refresh request fails or returns a malformed body.
	 */
	refreshNow(): Promise<void>;
}

/**
 * Convenience wrapper around `OfflineTokenProvider.login`.
 *
 * @param options the Keycloak/ROPC parameters (public client, no secret).
 * @returns a started `OfflineTokenProvider`.
 */
export function login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider>;
