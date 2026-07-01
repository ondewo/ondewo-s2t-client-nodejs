// Minimal, idiomatic usage example for the ONDEWO S2T NodeJS client.
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
// This module wraps the generated `Speech2TextClient` with a tiny, promise-based
// helper that shows the current ONDEWO auth convention: every request carries an
// `authorization: Bearer <jwt>` header sourced from the D18 Keycloak offline-token
// provider (see `auth/offlineTokenProvider.ts`). The gRPC calls themselves stay
// callback-based on the wire; the helper adapts them to promises so the example
// reads top-to-bottom.
//
// The helper depends on the RPCs it uses through the narrow `S2tServiceStub`
// interface and on the auth header through the narrow `BearerAuthProvider`
// interface, which makes it trivial to unit-test against fakes with no live
// server (see `s2tClient.spec.ts`). The real `Speech2TextClient` and the real
// `OfflineTokenProvider` both structurally satisfy these interfaces.

import * as grpc from '@grpc/grpc-js';

import { Speech2TextClient } from '../api/ondewo/s2t/speech-to-text_grpc_pb';
import { Empty } from '../api/google/protobuf/empty_pb';
import {
	ListS2tPipelinesRequest,
	ListS2tPipelinesResponse,
	S2tGetServiceInfoResponse,
	Speech2TextConfig
} from '../api/ondewo/s2t/speech-to-text_pb';

/** Connection parameters for the S2T gRPC endpoint. */
export interface ClientConfig {
	/** Server host, e.g. `localhost`. */
	host: string;
	/** Server port, e.g. `50051`. */
	port: string;
	/** Whether to open a TLS (secure) channel instead of a plaintext one. */
	secure: boolean;
	/** PEM root certificate for the TLS channel; ignored when `secure` is false. */
	grpcCert: Buffer | null;
}

/**
 * The subset of the generated `Speech2TextClient` surface this example calls.
 *
 * Depending on this narrow interface (rather than the concrete client) keeps the
 * helper fully typed against `@grpc/grpc-js` and lets tests inject a fake stub.
 * The generated `Speech2TextClient` satisfies it structurally.
 */
export interface S2tServiceStub {
	getServiceInfo(
		request: Empty,
		metadata: grpc.Metadata,
		onResponse: (error: grpc.ServiceError | null, response: S2tGetServiceInfoResponse) => void
	): grpc.ClientUnaryCall;
	listS2tPipelines(
		request: ListS2tPipelinesRequest,
		metadata: grpc.Metadata,
		onResponse: (error: grpc.ServiceError | null, response: ListS2tPipelinesResponse) => void
	): grpc.ClientUnaryCall;
}

/**
 * The auth capability this example needs: stamping the bearer `authorization`
 * header onto a gRPC `Metadata` object. The `OfflineTokenProvider` exported by
 * `auth/offlineTokenProvider.ts` satisfies this structurally.
 */
export interface BearerAuthProvider {
	applyToMetadata(metadata: grpc.Metadata): grpc.Metadata;
}

/**
 * Builds gRPC call metadata carrying the current `authorization: Bearer <jwt>`
 * header from the supplied auth provider.
 *
 * @param authProvider - The bearer-token provider (e.g. an `OfflineTokenProvider`).
 * @returns Fresh `Metadata` carrying the `authorization` header.
 */
export function buildAuthMetadata(authProvider: BearerAuthProvider): grpc.Metadata {
	const metadata: grpc.Metadata = new grpc.Metadata();
	authProvider.applyToMetadata(metadata);
	return metadata;
}

/** Promise-based convenience wrapper around a `Speech2TextClient`. */
export class S2tClient {
	private readonly stub: S2tServiceStub;
	private readonly metadata: grpc.Metadata;

	/**
	 * @param stub - The (real or faked) S2T service stub to call.
	 * @param metadata - The gRPC metadata (carrying the bearer header) sent with every call.
	 */
	public constructor(stub: S2tServiceStub, metadata: grpc.Metadata) {
		this.stub = stub;
		this.metadata = metadata;
	}

	/**
	 * Constructs a wrapper around a fresh `Speech2TextClient`, wiring the bearer
	 * `authorization` header from the auth provider into the call metadata.
	 *
	 * @param config - The connection parameters.
	 * @param authProvider - The bearer-token provider whose header is attached to every call.
	 * @returns A ready-to-use `S2tClient`.
	 */
	public static create(config: ClientConfig, authProvider: BearerAuthProvider): S2tClient {
		const address: string = `${config.host}:${config.port}`;
		let credentials: grpc.ChannelCredentials;
		if (config.secure) {
			credentials = grpc.credentials.createSsl(config.grpcCert);
		} else {
			credentials = grpc.credentials.createInsecure();
		}
		const stub: S2tServiceStub = new Speech2TextClient(address, credentials);
		return new S2tClient(stub, buildAuthMetadata(authProvider));
	}

	/**
	 * Fetches the S2T server info (a representative no-argument unary RPC).
	 *
	 * @returns The server-info response (carrying the S2T server version).
	 */
	public getServiceInfo(): Promise<S2tGetServiceInfoResponse> {
		const request: Empty = new Empty();
		return new Promise<S2tGetServiceInfoResponse>(
			(resolve: (value: S2tGetServiceInfoResponse) => void, reject: (reason: grpc.ServiceError) => void): void => {
				this.stub.getServiceInfo(
					request,
					this.metadata,
					(error: grpc.ServiceError | null, response: S2tGetServiceInfoResponse): void => {
						if (error !== null) {
							reject(error);
							return;
						}
						resolve(response);
					}
				);
			}
		);
	}

	/**
	 * Lists the S2T pipelines, optionally filtered by language (a representative
	 * unary RPC that builds a request message with fields).
	 *
	 * @param languages - Language codes to filter by; empty lists every pipeline.
	 * @returns The pipeline configs returned by the server.
	 */
	public listS2tPipelines(languages: string[] = []): Promise<Speech2TextConfig[]> {
		const request: ListS2tPipelinesRequest = new ListS2tPipelinesRequest();
		request.setLanguagesList(languages);
		return new Promise<Speech2TextConfig[]>(
			(resolve: (value: Speech2TextConfig[]) => void, reject: (reason: grpc.ServiceError) => void): void => {
				this.stub.listS2tPipelines(
					request,
					this.metadata,
					(error: grpc.ServiceError | null, response: ListS2tPipelinesResponse): void => {
						if (error !== null) {
							reject(error);
							return;
						}
						resolve(response.getPipelineConfigsList());
					}
				);
			}
		);
	}
}
