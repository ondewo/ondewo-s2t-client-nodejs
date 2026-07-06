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

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { OfflineTokenProvider } from '../auth/offlineTokenProvider';
import { ClientConfig, S2tClient } from './s2tClient';
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
function parseBoolean(value: string | undefined, fallback: boolean): boolean {
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
function buildConfigFromEnv(): ClientConfig {
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
function describeError(error: unknown): string {
	if (error !== null && typeof error === 'object' && 'code' in error && 'details' in error) {
		return `gRPC error (code=${String(error.code)}): ${String(error.details)}`;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

/**
 * Logs in via the Keycloak offline-token flow, builds an `S2tClient`, and prints
 * the S2T server version. Always stops the token provider's background refresh
 * loop on the way out.
 *
 * @returns A promise that resolves once the server version has been printed.
 */
async function main(): Promise<void> {
	console.log('START: getServiceInfo example');

	const keycloakUrl: string = process.env.KEYCLOAK_URL ?? 'https://keycloak.example.com/auth';
	const realm: string = process.env.KEYCLOAK_REALM ?? 'ondewo-ccai-platform';
	console.log(`Authenticating against Keycloak realm '${realm}' at ${keycloakUrl}`);
	const authProvider: OfflineTokenProvider = await OfflineTokenProvider.login({
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
	const client: S2tClient = S2tClient.create(config, authProvider);
	try {
		const info: S2tGetServiceInfoResponse = await client.getServiceInfo();
		console.log(`S2T service version: ${info.getVersion()}`);
	} finally {
		authProvider.stop();
	}

	console.log('DONE: getServiceInfo example');
}

if (require.main === module) {
	main().catch((error: unknown): void => {
		console.error(`FAILED: getServiceInfo example — ${describeError(error)}`);
		process.exit(1);
	});
}
