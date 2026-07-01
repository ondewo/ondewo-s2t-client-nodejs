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
// Configure it via environment variables (or an `examples/examples.env` file):
//   ONDEWO_KEYCLOAK_URL, ONDEWO_KEYCLOAK_REALM, ONDEWO_KEYCLOAK_CLIENT_ID,
//   ONDEWO_KEYCLOAK_USERNAME, ONDEWO_KEYCLOAK_PASSWORD,
//   ONDEWO_S2T_HOST, ONDEWO_S2T_PORT.

import * as dotenv from 'dotenv';

import { OfflineTokenProvider } from '../auth/offlineTokenProvider';
import { ClientConfig, S2tClient } from './s2tClient';
import { S2tGetServiceInfoResponse } from '../api/ondewo/s2t/speech-to-text_pb';

/**
 * Logs in via the Keycloak offline-token flow, builds an `S2tClient`, and prints
 * the S2T server version. Always stops the token provider's background refresh
 * loop on the way out.
 *
 * @returns A promise that resolves once the server version has been printed.
 */
async function main(): Promise<void> {
	dotenv.config({ path: `${process.cwd()}/examples/examples.env` });

	const authProvider: OfflineTokenProvider = await OfflineTokenProvider.login({
		keycloakUrl: process.env.ONDEWO_KEYCLOAK_URL ?? 'https://keycloak.example.com/auth',
		realm: process.env.ONDEWO_KEYCLOAK_REALM ?? 'ondewo-ccai-platform',
		clientId: process.env.ONDEWO_KEYCLOAK_CLIENT_ID ?? 'ondewo-nlu-cai-sdk-public',
		username: process.env.ONDEWO_KEYCLOAK_USERNAME ?? '',
		password: process.env.ONDEWO_KEYCLOAK_PASSWORD ?? ''
	});

	const config: ClientConfig = {
		host: process.env.ONDEWO_S2T_HOST ?? 'localhost',
		port: process.env.ONDEWO_S2T_PORT ?? '50051',
		secure: false,
		grpcCert: null
	};

	const client: S2tClient = S2tClient.create(config, authProvider);
	try {
		const info: S2tGetServiceInfoResponse = await client.getServiceInfo();
		console.log(`S2T service version: ${info.getVersion()}`);
	} finally {
		authProvider.stop();
	}
}

if (require.main === module) {
	void main();
}
