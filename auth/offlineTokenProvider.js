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
'use strict';

function buildTokenEndpoint(keycloakUrl, realm) {
	var base = String(keycloakUrl).replace(/\/+$/, '');
	return base + '/realms/' + realm + '/protocol/openid-connect/token';
}

async function requestToken(fetchImpl, tokenEndpoint, body) {
	var response = await fetchImpl(tokenEndpoint, {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: body.toString()
	});
	if (!response.ok) {
		var detail = await response.text().catch(function () {
			return '';
		});
		throw new Error(
			('Keycloak token request failed: HTTP ' + response.status + ' ' + response.statusText + ' ' + detail).trim()
		);
	}
	var parsed = await response.json();
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
class OfflineTokenProvider {
	constructor(options, initial) {
		this.tokenEndpoint = buildTokenEndpoint(options.keycloakUrl, options.realm);
		this.clientId = options.clientId;
		this.refreshSkewInMs = (options.refreshSkewInS === undefined ? 30 : options.refreshSkewInS) * 1000;
		this.deadlineEpochMs =
			options.tokenExpirationInS === undefined ? null : Date.now() + options.tokenExpirationInS * 1000;
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
	 */
	static async login(options) {
		var fetchImpl = options.fetchImpl === undefined ? fetch : options.fetchImpl;
		var tokenEndpoint = buildTokenEndpoint(options.keycloakUrl, options.realm);
		var body = new URLSearchParams({
			grant_type: 'password',
			client_id: options.clientId,
			username: options.username,
			password: options.password,
			scope: 'openid offline_access'
		});
		var initial = await requestToken(fetchImpl, tokenEndpoint, body);
		return new OfflineTokenProvider(options, initial);
	}

	/** Returns the current (valid) access token. */
	getAccessToken() {
		return this.accessToken;
	}

	/** Returns the ready-to-send `Authorization` header value (`Bearer <jwt>`). */
	getAuthorizationHeader() {
		return 'Bearer ' + this.accessToken;
	}

	/**
	 * Sets `authorization: Bearer <jwt>` on the supplied gRPC `Metadata`-like
	 * object and returns it (for chaining into a stub call).
	 */
	applyToMetadata(metadata) {
		metadata.set('authorization', this.getAuthorizationHeader());
		return metadata;
	}

	/**
	 * Stops the background refresh loop. Idempotent. After calling this the
	 * access token will lapse at its natural expiry and a new login is required.
	 */
	stop() {
		this.stopped = true;
		if (this.refreshTimer !== null) {
			clearTimeout(this.refreshTimer);
			this.refreshTimer = null;
		}
	}

	/** Exchanges the offline refresh token for a fresh access token immediately. */
	async refreshNow() {
		var body = new URLSearchParams({
			grant_type: 'refresh_token',
			client_id: this.clientId,
			refresh_token: this.refreshToken
		});
		var refreshed = await requestToken(this.fetchImpl, this.tokenEndpoint, body);
		this.accessToken = refreshed.access_token;
		// Keycloak may rotate the refresh token; keep the latest one.
		if (refreshed.refresh_token) {
			this.refreshToken = refreshed.refresh_token;
		}
		this.scheduleRefresh(refreshed.expires_in);
	}

	scheduleRefresh(expiresInS) {
		var self = this;
		if (this.stopped) {
			return;
		}
		if (this.deadlineEpochMs !== null && Date.now() >= this.deadlineEpochMs) {
			// The bounded auto-refresh window has elapsed; stop renewing.
			return;
		}

		var delayMs = expiresInS * 1000 - this.refreshSkewInMs;
		if (delayMs < 0) {
			delayMs = 0;
		}
		if (this.deadlineEpochMs !== null) {
			delayMs = Math.min(delayMs, this.deadlineEpochMs - Date.now());
		}

		this.refreshTimer = setTimeout(function () {
			self.refreshNow().catch(function () {
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
 * @param {object} options the Keycloak/ROPC parameters (public client, no secret).
 * @returns {Promise<OfflineTokenProvider>} a started provider.
 */
async function login(options) {
	return OfflineTokenProvider.login(options);
}

module.exports = { OfflineTokenProvider: OfflineTokenProvider, login: login };
