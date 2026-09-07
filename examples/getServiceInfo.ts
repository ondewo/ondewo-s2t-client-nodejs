// Runnable end-to-end example: authenticate against Keycloak and fetch the S2T
// server info.
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
// Run against a live server with:
//
//   npx tsc examples/getServiceInfo.ts --outDir .run --module commonjs \
//       --target es2020 --skipLibCheck --types node
//   node .run/getServiceInfo.js
//
// Configuration is read from `examples/environment.env` (loaded via dotenv with a
// path relative to this script, so the working directory does not matter). See
// that file for the full list of variables; the canonical ones this example
// consumes are:
//   Connection:     ONDEWO_HOST, ONDEWO_PORT
//   Secure channel: ONDEWO_USE_SECURE_CHANNEL, ONDEWO_GRPC_CERT
//   Keycloak:       KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID,
//                   KEYCLOAK_USER_NAME, KEYCLOAK_PASSWORD, KEYCLOAK_VERIFY_SSL
//
// `main` takes its two outside-world boundaries -- the Keycloak login and the S2T
// client factory -- as injectable overrides that default to the real ones, so the
// whole flow is unit-tested with no network and no live server (see
// `getServiceInfo.spec.ts`) while running the file directly is unaffected.

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { OfflineTokenLoginOptions, OfflineTokenProvider } from '../auth/offlineTokenProvider';
import { BearerAuthProvider, ClientConfig, S2tClient } from './s2tClient';
import { S2tGetServiceInfoResponse } from '../api/ondewo/s2t/speech-to-text_pb';

dotenv.config({ path: path.join(__dirname, 'environment.env') });

/**
 * Parses a boolean-valued environment variable, treating an unset or empty value
 * as the supplied fallback and any case-insensitive `true` as `true`.
 *
 * @param value - The raw environment-variable value (may be undefined).
 * @param fallback - The value to use when unset or empty.
 * @returns The parsed boolean.
 */
export function parseBoolean(value: string | undefined, fallback: boolean): boolean {
	if (value === undefined || value.trim() === '') {
		return fallback;
	}
	return value.trim().toLowerCase() === 'true';
}

/**
 * Builds the S2T connection config from the canonical environment variables,
 * loading the PEM root certificate from `ONDEWO_GRPC_CERT` only for a secure
 * channel that names one.
 *
 * @returns The connection parameters for `S2tClient.create`.
 */
export function buildConfigFromEnv(): ClientConfig {
	const secure: boolean = parseBoolean(process.env.ONDEWO_USE_SECURE_CHANNEL, false);
	const certPath: string = process.env.ONDEWO_GRPC_CERT ?? '';
	let grpcCert: Buffer | null = null;
	if (secure && certPath !== '') {
		console.log(`Loading gRPC root certificate from ${certPath}`);
		grpcCert = fs.readFileSync(certPath);
	}
	return {
		host: process.env.ONDEWO_HOST ?? 'localhost',
		port: process.env.ONDEWO_PORT ?? '50051',
		secure,
		grpcCert
	};
}

/**
 * Formats an unknown error for logging, surfacing the gRPC status code and
 * details when the error is a gRPC `ServiceError`.
 *
 * @param error - The caught error.
 * @returns A human-readable description (never leaking credentials).
 */
export function describeError(error: unknown): string {
	if (error !== null && typeof error === 'object' && 'code' in error && 'details' in error) {
		return `gRPC error (code=${String(error.code)}): ${String(error.details)}`;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

/** The subset of `S2tClient` that {@link main} drives. */
export interface ServiceInfoClient {
	/** Fetches the S2T server info. */
	getServiceInfo(): Promise<S2tGetServiceInfoResponse>;
}

/** Injectable `OfflineTokenProvider.login` signature -- the Keycloak boundary of the example. */
export type LoginFunction = (options: OfflineTokenLoginOptions) => Promise<OfflineTokenProvider>;

/** Injectable `S2tClient.create` signature -- the S2T-server boundary of the example. */
export type S2tClientFactory = (config: ClientConfig, authProvider: BearerAuthProvider) => ServiceInfoClient;

/**
 * Constructs the real `S2tClient`. This is the default {@link S2tClientFactory} of
 * {@link main}; constructing it opens no connection (gRPC-js dials lazily on the
 * first call).
 *
 * @param config - The connection parameters.
 * @param authProvider - The bearer-token provider stamped onto every call.
 * @returns The real `S2tClient` bound to `config`.
 */
export function createS2tClient(config: ClientConfig, authProvider: BearerAuthProvider): ServiceInfoClient {
	return S2tClient.create(config, authProvider);
}

/**
 * Optional replacements for the two boundaries of {@link main} that touch the
 * outside world. Both default to the real implementations, so running this file
 * directly is unaffected; a unit test substitutes them to drive the whole flow
 * offline.
 */
export interface GetServiceInfoOverrides {
	/** Replacement for `OfflineTokenProvider.login`; defaults to the real login. */
	loginImpl?: LoginFunction;
	/** Replacement for {@link createS2tClient}; defaults to the real `S2tClient`. */
	createClient?: S2tClientFactory;
}

/**
 * Logs in via the Keycloak offline-token flow, builds an `S2tClient`, and prints
 * the S2T server version. Always stops the token provider's background refresh
 * loop on the way out.
 *
 * @param overrides - Optional replacements for the two outside-world boundaries
 *   (see {@link GetServiceInfoOverrides}); both default to the real ones.
 * @returns A promise that resolves once the server version has been printed.
 */
export async function main(overrides: GetServiceInfoOverrides = {}): Promise<void> {
	console.log('START: getServiceInfo example');

	// The two boundaries that touch the outside world; a unit test replaces them, the example does not.
	const loginImpl: LoginFunction = overrides.loginImpl ?? OfflineTokenProvider.login;
	const createClient: S2tClientFactory = overrides.createClient ?? createS2tClient;

	const keycloakUrl: string = process.env.KEYCLOAK_URL ?? 'https://keycloak.example.com/auth';
	const realm: string = process.env.KEYCLOAK_REALM ?? 'ondewo-ccai-platform';
	console.log(`Authenticating against Keycloak realm '${realm}' at ${keycloakUrl}`);
	const authProvider: OfflineTokenProvider = await loginImpl({
		keycloakUrl,
		realm,
		clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'ondewo-nlu-cai-sdk-public',
		username: process.env.KEYCLOAK_USER_NAME ?? '',
		password: process.env.KEYCLOAK_PASSWORD ?? '',
		keycloakVerifySsl: parseBoolean(process.env.KEYCLOAK_VERIFY_SSL, true)
	});
	console.log('Authentication succeeded; obtained an access token.');

	const config: ClientConfig = buildConfigFromEnv();
	console.log(`Connecting to S2T server at ${config.host}:${config.port} (secure=${config.secure})`);
	const client: ServiceInfoClient = createClient(config, authProvider);
	try {
		const info: S2tGetServiceInfoResponse = await client.getServiceInfo();
		console.log(`S2T service version: ${info.getVersion()}`);
	} finally {
		authProvider.stop();
	}

	console.log('DONE: getServiceInfo example');
}

// Run only when executed directly (`node getServiceInfo.js`), not when imported by the unit test.
/* c8 ignore next 7 -- direct-run entrypoint: the spec imports this module, so `require.main === module` is false under the test runner, and the `process.exit(1)` path cannot run in-process */
if (require.main === module) {
	main().catch((error: unknown): void => {
		console.error(`FAILED: getServiceInfo example — ${describeError(error)}`);
		process.exit(1);
	});
}
