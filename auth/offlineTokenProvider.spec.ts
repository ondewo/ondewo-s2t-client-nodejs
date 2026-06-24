/* eslint-disable @typescript-eslint/no-explicit-any */
// Unit tests for the D18 offline-token helper. Runs on the built-in node:test
// runner with no network access -- the Keycloak token endpoint is mocked via an
// injected `fetch` implementation. Node 22 strips the TypeScript types natively:
//
//   node --test auth/offlineTokenProvider.spec.ts

import { strict as assert } from 'node:assert';
import { test as runTest } from 'node:test';

import { login, OfflineTokenProvider } from './offlineTokenProvider.js';
import type { MetadataLike } from './offlineTokenProvider.js';

const KEYCLOAK_URL: string = 'https://keycloak.example.com/auth';
const REALM: string = 'ondewo-ccai-platform';
const CLIENT_ID: string = 'ondewo-nlu-cai-sdk-public';
const USERNAME: string = 'ondewo-nlu-cai-tech-myproject-bot';
const PASSWORD: string = 'super-secret';
const EXPECTED_TOKEN_ENDPOINT: string =
	'https://keycloak.example.com/auth/realms/ondewo-ccai-platform/protocol/openid-connect/token';

interface CannedResponse {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	status?: number;
}

interface CapturedCall {
	url: string;
	method: string;
	params: URLSearchParams;
}

interface FetchMock {
	fetchImpl: typeof fetch;
	calls: CapturedCall[];
}

// Builds a mock `fetch` that records every call and replays a queue of canned
// token-endpoint responses. No network is touched.
function buildFetchMock(responses: CannedResponse[]): FetchMock {
	const calls: CapturedCall[] = [];
	let index: number = 0;

	const fetchImpl: any = (input: any, init: any): Promise<any> => {
		const bodyText: string = init && init.body ? String(init.body) : '';
		calls.push({
			url: String(input),
			method: init && init.method ? String(init.method) : 'GET',
			params: new URLSearchParams(bodyText)
		});

		const canned: CannedResponse | undefined = responses[index];
		index = index + 1;
		const status: number = canned && canned.status !== undefined ? canned.status : 200;
		const ok: boolean = status >= 200 && status < 300;
		return Promise.resolve({
			ok: ok,
			status: status,
			statusText: ok ? 'OK' : 'Error',
			json: (): Promise<CannedResponse | undefined> => Promise.resolve(canned),
			text: (): Promise<string> => Promise.resolve(JSON.stringify(canned))
		});
	};

	return { fetchImpl: fetchImpl as typeof fetch, calls: calls };
}

// Minimal in-memory stand-in for a gRPC `Metadata` object.
class FakeMetadata implements MetadataLike {
	public readonly store: Record<string, string> = {};
	public set(key: string, value: string): void {
		this.store[key] = value;
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise<void>((resolve: () => void): void => {
		setTimeout(resolve, ms);
	});
}

runTest('login performs ROPC against the public client with offline_access scope', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 }]);

	const provider: OfflineTokenProvider = await login({
		keycloakUrl: KEYCLOAK_URL,
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		fetchImpl: mock.fetchImpl
	});
	provider.stop();

	assert.equal(mock.calls.length, 1);
	const call: CapturedCall = mock.calls[0];
	assert.equal(call.url, EXPECTED_TOKEN_ENDPOINT);
	assert.equal(call.method, 'POST');
	assert.equal(call.params.get('grant_type'), 'password');
	assert.equal(call.params.get('client_id'), CLIENT_ID);
	assert.equal(call.params.get('username'), USERNAME);
	assert.equal(call.params.get('password'), PASSWORD);
	assert.equal(call.params.get('scope'), 'openid offline_access');
	// Public client (Q1): no client_secret must ever be sent.
	assert.equal(call.params.get('client_secret'), null);

	assert.equal(provider.getAccessToken(), 'access-1');
	assert.equal(provider.getAuthorizationHeader(), 'Bearer access-1');
});

runTest('applyToMetadata sets the Authorization Bearer header', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 }]);
	const provider: OfflineTokenProvider = await login({
		keycloakUrl: KEYCLOAK_URL,
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		fetchImpl: mock.fetchImpl
	});
	provider.stop();

	const metadata: FakeMetadata = new FakeMetadata();
	const returned: FakeMetadata = provider.applyToMetadata(metadata);
	assert.equal(returned, metadata);
	assert.equal(metadata.store['authorization'], 'Bearer access-1');
});

runTest('refreshNow exchanges the offline refresh token and rotates it', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([
		{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 },
		{ access_token: 'access-2', refresh_token: 'offline-2', expires_in: 300 }
	]);

	const provider: OfflineTokenProvider = await login({
		keycloakUrl: KEYCLOAK_URL,
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		fetchImpl: mock.fetchImpl
	});

	await provider.refreshNow();
	provider.stop();

	assert.equal(mock.calls.length, 2);
	const refreshCall: CapturedCall = mock.calls[1];
	assert.equal(refreshCall.params.get('grant_type'), 'refresh_token');
	assert.equal(refreshCall.params.get('client_id'), CLIENT_ID);
	assert.equal(refreshCall.params.get('refresh_token'), 'offline-1');
	assert.equal(refreshCall.params.get('client_secret'), null);

	// Access token rotated to the refreshed value.
	assert.equal(provider.getAccessToken(), 'access-2');
});

runTest('the background loop auto-refreshes the access token before expiry', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([
		// expires_in tiny so the scheduled refresh fires almost immediately.
		{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 0 },
		{ access_token: 'access-2', refresh_token: 'offline-2', expires_in: 300 }
	]);

	const provider: OfflineTokenProvider = await login({
		keycloakUrl: KEYCLOAK_URL,
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		refreshSkewInS: 0,
		fetchImpl: mock.fetchImpl
	});

	// Wait for the scheduled timer (delay 0) to fire and complete the refresh.
	await sleep(50);
	provider.stop();

	assert.equal(provider.getAccessToken(), 'access-2');
});

runTest('the auto-refresh loop stops after tokenExpirationInS elapses', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([
		{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 0 },
		{ access_token: 'access-2', refresh_token: 'offline-2', expires_in: 0 }
	]);

	const provider: OfflineTokenProvider = await login({
		keycloakUrl: KEYCLOAK_URL,
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		refreshSkewInS: 0,
		// Window already elapsed by the time the first refresh would be scheduled.
		tokenExpirationInS: 0,
		fetchImpl: mock.fetchImpl
	});

	await sleep(50);
	provider.stop();

	// Only the initial login call happened; no background refresh was scheduled
	// because the bounded window had already elapsed.
	assert.equal(mock.calls.length, 1);
	assert.equal(provider.getAccessToken(), 'access-1');
});

runTest('a failed token request raises a descriptive error', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([{ status: 401, access_token: '', refresh_token: '', expires_in: 0 }]);

	await assert.rejects(
		(): Promise<OfflineTokenProvider> =>
			login({
				keycloakUrl: KEYCLOAK_URL,
				realm: REALM,
				clientId: CLIENT_ID,
				username: USERNAME,
				password: 'wrong',
				fetchImpl: mock.fetchImpl
			}),
		/HTTP 401/
	);
});

runTest('a token response missing access_token is rejected', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([{ refresh_token: 'offline-1', expires_in: 300 }]);

	await assert.rejects(
		(): Promise<OfflineTokenProvider> =>
			login({
				keycloakUrl: KEYCLOAK_URL,
				realm: REALM,
				clientId: CLIENT_ID,
				username: USERNAME,
				password: PASSWORD,
				fetchImpl: mock.fetchImpl
			}),
		/missing access_token/
	);
});

runTest('a trailing slash in keycloakUrl does not duplicate the path separator', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 }]);
	const provider: OfflineTokenProvider = await login({
		keycloakUrl: 'https://keycloak.example.com/auth/',
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		fetchImpl: mock.fetchImpl
	});
	provider.stop();
	assert.equal(mock.calls[0].url, EXPECTED_TOKEN_ENDPOINT);
});

runTest('OfflineTokenProvider.login is the static entry point used by login()', async (): Promise<void> => {
	const mock: FetchMock = buildFetchMock([{ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 }]);
	const provider: OfflineTokenProvider = await OfflineTokenProvider.login({
		keycloakUrl: KEYCLOAK_URL,
		realm: REALM,
		clientId: CLIENT_ID,
		username: USERNAME,
		password: PASSWORD,
		fetchImpl: mock.fetchImpl
	});
	provider.stop();
	assert.ok(provider instanceof OfflineTokenProvider);
});
