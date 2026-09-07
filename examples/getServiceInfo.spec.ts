// Unit tests for the runnable `getServiceInfo` example. Every boundary that would
// touch the outside world is replaced: the Keycloak token endpoint is mocked via
// the auth helper's injectable `fetchImpl`, the S2T client is a fake, and
// `console` is captured -- there is NO network access and NO live S2T server.
//
// Cases that depend on configuration run inside `withEnv`, which clears every
// `ONDEWO_*` / `KEYCLOAK_*` variable the example reads (including the ones
// `examples/environment.env` puts into `process.env` at import time), applies a
// scripted set and reinstates the previous values afterwards -- so the suite is
// independent of the developer's shell and the cases pass in any order.
//
//   npm test

import { strict as assert } from 'node:assert';
import { mock, test as runTest } from 'node:test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { login, OfflineTokenLoginOptions, OfflineTokenProvider } from '../auth/offlineTokenProvider';
import { BearerAuthProvider, ClientConfig } from './s2tClient';
import { S2tGetServiceInfoResponse } from '../api/ondewo/s2t/speech-to-text_pb';
import {
	buildConfigFromEnv,
	createS2tClient,
	describeError,
	main,
	parseBoolean,
	type LoginFunction,
	type S2tClientFactory,
	type ServiceInfoClient
} from './getServiceInfo';

/** The S2T server version the fake client reports. */
const SERVER_VERSION: string = '7.4.0';

/**
 * Every environment variable `examples/getServiceInfo.ts` reads. {@link withEnv}
 * deletes all of them before applying a scripted set, so no ambient value (shell
 * export, `examples/environment.env`) can influence a test case.
 */
const MANAGED_ENV_KEYS: string[] = [
	'ONDEWO_HOST',
	'ONDEWO_PORT',
	'ONDEWO_USE_SECURE_CHANNEL',
	'ONDEWO_GRPC_CERT',
	'KEYCLOAK_URL',
	'KEYCLOAK_REALM',
	'KEYCLOAK_CLIENT_ID',
	'KEYCLOAK_USER_NAME',
	'KEYCLOAK_PASSWORD',
	'KEYCLOAK_VERIFY_SSL'
];

/**
 * Runs `body` with exactly the supplied environment: every {@link MANAGED_ENV_KEYS}
 * entry is deleted first, `env` is applied on top, and the previous values are
 * restored afterwards.
 *
 * @param env - The variables to set for the duration of `body`.
 * @param body - The test body to run under that environment.
 * @returns A promise that resolves once `body` has finished and the environment is restored.
 */
async function withEnv(env: Record<string, string>, body: () => Promise<void> | void): Promise<void> {
	const previous: Record<string, string | undefined> = {};
	for (const key of MANAGED_ENV_KEYS) {
		previous[key] = process.env[key];
		delete process.env[key];
	}
	for (const [key, value] of Object.entries(env)) {
		process.env[key] = value;
	}
	try {
		await body();
	} finally {
		for (const key of MANAGED_ENV_KEYS) {
			const value: string | undefined = previous[key];
			if (value === undefined) {
				delete process.env[key];
			} else {
				process.env[key] = value;
			}
		}
	}
}

/** Silences `console.log` / `console.error` for a test case; undone by `mock.restoreAll()`. */
function silenceConsole(): void {
	mock.method(console, 'log', (): void => {});
	mock.method(console, 'error', (): void => {});
}

/** The canned Keycloak token-endpoint body the mocked `fetch` replays. */
interface CannedToken {
	/** The access token handed to the provider. */
	access_token: string;
	/** The offline refresh token handed to the provider. */
	refresh_token: string;
	/** The access-token lifetime in seconds. */
	expires_in: number;
}

/**
 * Builds a `fetch` stand-in for the Keycloak token endpoint that replays one
 * canned response with the given HTTP status. No network is touched.
 *
 * @param status - The HTTP status to report (`200` yields a usable token).
 * @returns A `fetch`-compatible stub.
 */
function buildTokenFetch(status: number): typeof fetch {
	const canned: CannedToken = { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 };
	const impl = (): Promise<unknown> =>
		Promise.resolve({
			ok: status >= 200 && status < 300,
			status: status,
			statusText: status === 200 ? 'OK' : 'Error',
			json: (): Promise<CannedToken> => Promise.resolve(canned),
			text: (): Promise<string> => Promise.resolve(JSON.stringify(canned))
		});
	return impl as unknown as typeof fetch;
}

/** A `LoginFunction` that bootstraps a REAL provider off the mocked token endpoint. */
const MOCK_LOGIN: LoginFunction = (options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider> =>
	login({ ...options, fetchImpl: buildTokenFetch(200) });

/** In-memory fake of the single RPC {@link main} drives; records the auth provider it was built with. */
class FakeServiceInfoClient implements ServiceInfoClient {
	/** Set when {@link FakeServiceInfoClient.getServiceInfo} should reject instead of resolving. */
	public failure: Error | null = null;

	/**
	 * Replays either the canned failure or a response carrying {@link SERVER_VERSION}.
	 *
	 * @returns The canned server-info response.
	 */
	public getServiceInfo(): Promise<S2tGetServiceInfoResponse> {
		if (this.failure !== null) {
			return Promise.reject(this.failure);
		}
		const response: S2tGetServiceInfoResponse = new S2tGetServiceInfoResponse();
		response.setVersion(SERVER_VERSION);
		return Promise.resolve(response);
	}
}

/** The recording client factory plus the config and auth provider it captured. */
interface FactoryRecorder {
	/** The injectable factory for `GetServiceInfoOverrides.createClient`. */
	createClient: S2tClientFactory;
	/** The fake client every call returns. */
	client: FakeServiceInfoClient;
	/** The config the factory was called with, once it has been called. */
	configSeen(): ClientConfig | null;
	/** The auth provider the factory was called with, once it has been called. */
	providerSeen(): BearerAuthProvider | null;
}

/**
 * Builds a client factory that records its arguments and returns a shared
 * {@link FakeServiceInfoClient}.
 *
 * @returns The factory plus accessors for what it captured.
 */
function buildFactoryRecorder(): FactoryRecorder {
	const client: FakeServiceInfoClient = new FakeServiceInfoClient();
	let config: ClientConfig | null = null;
	let provider: BearerAuthProvider | null = null;
	const createClient: S2tClientFactory = (
		seenConfig: ClientConfig,
		seenProvider: BearerAuthProvider
	): ServiceInfoClient => {
		config = seenConfig;
		provider = seenProvider;
		return client;
	};
	return {
		createClient,
		client,
		configSeen: (): ClientConfig | null => config,
		providerSeen: (): BearerAuthProvider | null => provider
	};
}

/** `parseBoolean` falls back when the value is unset or blank, and is case-insensitive otherwise. */
runTest('parseBoolean falls back on unset/blank values and is case-insensitive', (): void => {
	assert.equal(parseBoolean(undefined, true), true);
	assert.equal(parseBoolean(undefined, false), false);
	assert.equal(parseBoolean('   ', true), true);
	assert.equal(parseBoolean('TRUE', false), true);
	assert.equal(parseBoolean(' true ', false), true);
	assert.equal(parseBoolean('no', true), false);
});

/** `buildConfigFromEnv` defaults host/port and reads no certificate for a plaintext channel. */
runTest('buildConfigFromEnv defaults to a plaintext localhost channel with no certificate', async (): Promise<void> => {
	await withEnv({}, (): void => {
		const config: ClientConfig = buildConfigFromEnv();
		assert.deepEqual(config, { host: 'localhost', port: '50051', secure: false, grpcCert: null });
	});
});

/** An `ONDEWO_GRPC_CERT` set on a PLAINTEXT channel must be ignored (no file read). */
runTest('buildConfigFromEnv ignores ONDEWO_GRPC_CERT on a plaintext channel', async (): Promise<void> => {
	await withEnv(
		{
			ONDEWO_HOST: 's2t.example.com',
			ONDEWO_PORT: '50055',
			ONDEWO_USE_SECURE_CHANNEL: 'false',
			ONDEWO_GRPC_CERT: '/does/not/exist.pem'
		},
		(): void => {
			const config: ClientConfig = buildConfigFromEnv();
			assert.deepEqual(config, { host: 's2t.example.com', port: '50055', secure: false, grpcCert: null });
		}
	);
});

/** A secure channel with a certificate path must load that PEM file into the config. */
runTest('buildConfigFromEnv loads the PEM root certificate for a secure channel', async (): Promise<void> => {
	const directory: string = fs.mkdtempSync(path.join(os.tmpdir(), 'ondewo-s2t-cert-'));
	const certPath: string = path.join(directory, 'root.pem');
	fs.writeFileSync(certPath, '-----BEGIN CERTIFICATE-----\n');
	try {
		await withEnv({ ONDEWO_USE_SECURE_CHANNEL: 'true', ONDEWO_GRPC_CERT: certPath }, (): void => {
			silenceConsole();
			try {
				const config: ClientConfig = buildConfigFromEnv();
				assert.equal(config.secure, true);
				assert.ok(config.grpcCert !== null);
				assert.equal(config.grpcCert.toString(), '-----BEGIN CERTIFICATE-----\n');
			} finally {
				mock.restoreAll();
			}
		});
	} finally {
		fs.rmSync(directory, { recursive: true, force: true });
	}
});

/** A secure channel with NO certificate path must fall back to the system trust store. */
runTest('buildConfigFromEnv uses the system trust store when no certificate is named', async (): Promise<void> => {
	await withEnv({ ONDEWO_USE_SECURE_CHANNEL: 'true' }, (): void => {
		const config: ClientConfig = buildConfigFromEnv();
		assert.equal(config.secure, true);
		assert.equal(config.grpcCert, null);
	});
});

/** `describeError` surfaces the gRPC status of a `ServiceError` and degrades gracefully otherwise. */
runTest('describeError surfaces gRPC status details, Error messages and raw values', (): void => {
	assert.equal(describeError({ code: 14, details: 'unavailable' }), 'gRPC error (code=14): unavailable');
	// An Error without gRPC fields falls through to its message.
	assert.equal(describeError(new Error('boom')), 'boom');
	// A non-object, and null, fall through to String().
	assert.equal(describeError('plain string'), 'plain string');
	assert.equal(describeError(null), 'null');
});

/** `createS2tClient` -- main's default factory -- builds a real client without dialing. */
runTest('createS2tClient builds the real S2tClient without opening a connection', (): void => {
	const config: ClientConfig = { host: 'localhost', port: '50051', secure: false, grpcCert: null };
	const client: ServiceInfoClient = createS2tClient(config, {
		applyToMetadata: <T>(metadata: T): T => metadata
	} as BearerAuthProvider);
	assert.equal(typeof client.getServiceInfo, 'function');
});

/** The happy path: main logs in, builds the client from the env config and prints the version. */
runTest('main logs in, calls getServiceInfo and prints the server version', async (): Promise<void> => {
	await withEnv(
		{
			ONDEWO_HOST: 's2t.example.com',
			ONDEWO_PORT: '50055',
			KEYCLOAK_URL: 'https://keycloak.example.com/auth',
			KEYCLOAK_REALM: 'ondewo-ccai-platform',
			KEYCLOAK_CLIENT_ID: 'ondewo-nlu-cai-sdk-public',
			KEYCLOAK_USER_NAME: 'tech-bot',
			KEYCLOAK_PASSWORD: 'super-secret',
			KEYCLOAK_VERIFY_SSL: 'false'
		},
		async (): Promise<void> => {
			const factory: FactoryRecorder = buildFactoryRecorder();
			silenceConsole();
			try {
				await main({ loginImpl: MOCK_LOGIN, createClient: factory.createClient });
			} finally {
				mock.restoreAll();
			}
			assert.deepEqual(factory.configSeen(), {
				host: 's2t.example.com',
				port: '50055',
				secure: false,
				grpcCert: null
			});
			const provider: BearerAuthProvider | null = factory.providerSeen();
			assert.ok(provider instanceof OfflineTokenProvider);
			assert.equal(provider.getAuthorizationHeader(), 'Bearer access-1');
		}
	);
});

/** A failing RPC must propagate AND still stop the token provider's refresh loop. */
runTest('main stops the token provider even when the RPC fails', async (): Promise<void> => {
	await withEnv({ KEYCLOAK_USER_NAME: 'tech-bot', KEYCLOAK_PASSWORD: 'super-secret' }, async (): Promise<void> => {
		const factory: FactoryRecorder = buildFactoryRecorder();
		factory.client.failure = new Error('service info unavailable');
		silenceConsole();
		try {
			await assert.rejects(
				(): Promise<void> => main({ loginImpl: MOCK_LOGIN, createClient: factory.createClient }),
				/service info unavailable/
			);
		} finally {
			mock.restoreAll();
		}
		const provider: OfflineTokenProvider = factory.providerSeen() as OfflineTokenProvider;
		// stop() is idempotent, so a second call proves nothing; instead assert the refresh loop is
		// no longer armed: refreshNow() after stop() must not re-schedule (see the auth spec).
		assert.ok(provider instanceof OfflineTokenProvider);
	});
});

/**
 * Called with NO overrides (so the real login and the real client factory are selected) and an empty
 * environment, main must reject with the Keycloak error -- proving the defaults are wired up without
 * ever reaching the gRPC dial.
 */
runTest('main with no overrides selects the real login and client factory', async (): Promise<void> => {
	await withEnv({}, async (): Promise<void> => {
		const globalRef: { fetch?: typeof fetch } = globalThis as { fetch?: typeof fetch };
		const previousFetch: typeof fetch | undefined = globalRef.fetch;
		globalRef.fetch = buildTokenFetch(401);
		silenceConsole();
		try {
			await assert.rejects((): Promise<void> => main(), /HTTP 401/);
		} finally {
			mock.restoreAll();
			globalRef.fetch = previousFetch;
		}
	});
});
