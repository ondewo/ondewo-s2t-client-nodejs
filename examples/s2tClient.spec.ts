// Mock-based tests for the S2T client example. They exercise the example's
// request-building and response-handling logic with the gRPC stub and the auth
// provider fully faked -- no live server, no network. Compiled by `tsc` and run
// on node's built-in test runner:
//
//   npm run test:examples

import { strict as assert } from 'node:assert';
import { test as runTest } from 'node:test';

import * as grpc from '@grpc/grpc-js';

import { Empty } from '../api/google/protobuf/empty_pb';
import {
	ListS2tPipelinesRequest,
	ListS2tPipelinesResponse,
	S2tGetServiceInfoResponse,
	Speech2TextConfig
} from '../api/ondewo/s2t/speech-to-text_pb';
import { BearerAuthProvider, buildAuthMetadata, ClientConfig, S2tClient, S2tServiceStub } from './s2tClient';

/** The bearer token the fake auth provider stamps onto request metadata. */
const BEARER_TOKEN: string = 'Bearer test-access-token';
/** The server version the fake stub reports from `getServiceInfo`. */
const SERVER_VERSION: string = '7.4.0';
/** The language filter the pipeline-listing test passes through the request. */
const LANGUAGE: string = 'en-US';

/** Fake `BearerAuthProvider` that stamps a fixed bearer header, mimicking `OfflineTokenProvider`. */
class FakeAuthProvider implements BearerAuthProvider {
	/**
	 * Sets the fixed `authorization` header on the metadata and returns it.
	 *
	 * @param metadata - The gRPC metadata to stamp.
	 * @returns The same metadata object, now carrying the bearer header.
	 */
	public applyToMetadata(metadata: grpc.Metadata): grpc.Metadata {
		metadata.set('authorization', BEARER_TOKEN);
		return metadata;
	}
}

/** In-memory fake of the S2T service stub that records calls and replays canned responses. */
class FakeStub implements S2tServiceStub {
	public serviceInfoRequest: Empty | null = null;
	public serviceInfoMetadata: grpc.Metadata | null = null;
	public serviceInfoError: grpc.ServiceError | null = null;

	public pipelinesRequest: ListS2tPipelinesRequest | null = null;
	public pipelinesError: grpc.ServiceError | null = null;
	public pipelineConfigs: Speech2TextConfig[] = [];

	/**
	 * Records the request/metadata and replays either the canned error or a
	 * `S2tGetServiceInfoResponse` carrying {@link SERVER_VERSION}.
	 *
	 * @param request - The Empty request forwarded by the wrapper.
	 * @param metadata - The call metadata forwarded by the wrapper.
	 * @param onResponse - The gRPC completion callback.
	 * @returns A throwaway stand-in for the gRPC call handle.
	 */
	public getServiceInfo(
		request: Empty,
		metadata: grpc.Metadata,
		onResponse: (error: grpc.ServiceError | null, response: S2tGetServiceInfoResponse) => void
	): grpc.ClientUnaryCall {
		this.serviceInfoRequest = request;
		this.serviceInfoMetadata = metadata;
		const response: S2tGetServiceInfoResponse = new S2tGetServiceInfoResponse();
		response.setVersion(SERVER_VERSION);
		onResponse(this.serviceInfoError, response);
		return {} as grpc.ClientUnaryCall;
	}

	/**
	 * Records the request and replays either the canned error or a response
	 * carrying {@link FakeStub.pipelineConfigs}.
	 *
	 * @param request - The list request forwarded by the wrapper.
	 * @param metadata - The call metadata forwarded by the wrapper.
	 * @param onResponse - The gRPC completion callback.
	 * @returns A throwaway stand-in for the gRPC call handle.
	 */
	public listS2tPipelines(
		request: ListS2tPipelinesRequest,
		metadata: grpc.Metadata,
		onResponse: (error: grpc.ServiceError | null, response: ListS2tPipelinesResponse) => void
	): grpc.ClientUnaryCall {
		this.pipelinesRequest = request;
		const response: ListS2tPipelinesResponse = new ListS2tPipelinesResponse();
		response.setPipelineConfigsList(this.pipelineConfigs);
		onResponse(this.pipelinesError, response);
		return {} as grpc.ClientUnaryCall;
	}
}

/** `buildAuthMetadata` must stamp the provider's bearer header onto fresh metadata. */
runTest('buildAuthMetadata attaches the bearer authorization header', (): void => {
	const metadata: grpc.Metadata = buildAuthMetadata(new FakeAuthProvider());
	assert.deepEqual(metadata.get('authorization'), [BEARER_TOKEN]);
});

/** `getServiceInfo` must forward an Empty request plus the auth metadata and resolve the version. */
runTest('getServiceInfo forwards the auth metadata and resolves the server version', async (): Promise<void> => {
	const stub: FakeStub = new FakeStub();
	const metadata: grpc.Metadata = buildAuthMetadata(new FakeAuthProvider());
	const client: S2tClient = new S2tClient(stub, metadata);

	const response: S2tGetServiceInfoResponse = await client.getServiceInfo();

	assert.ok(stub.serviceInfoRequest instanceof Empty);
	assert.equal(stub.serviceInfoMetadata, metadata);
	assert.deepEqual(stub.serviceInfoMetadata?.get('authorization'), [BEARER_TOKEN]);
	assert.equal(response.getVersion(), SERVER_VERSION);
});

/** A gRPC error from `getServiceInfo` must reject the returned promise. */
runTest('getServiceInfo rejects when the gRPC call errors', async (): Promise<void> => {
	const stub: FakeStub = new FakeStub();
	stub.serviceInfoError = Object.assign(new Error('boom'), {
		code: grpc.status.INTERNAL,
		details: 'boom',
		metadata: new grpc.Metadata()
	});
	const client: S2tClient = new S2tClient(stub, new grpc.Metadata());

	await assert.rejects((): Promise<S2tGetServiceInfoResponse> => client.getServiceInfo(), /boom/);
});

/** `listS2tPipelines` must set the language filter on the request and map the response configs. */
runTest('listS2tPipelines sets the language filter and maps the pipeline configs', async (): Promise<void> => {
	const stub: FakeStub = new FakeStub();
	stub.pipelineConfigs = [new Speech2TextConfig(), new Speech2TextConfig()];
	const client: S2tClient = new S2tClient(stub, new grpc.Metadata());

	const configs: Speech2TextConfig[] = await client.listS2tPipelines([LANGUAGE]);

	assert.deepEqual(stub.pipelinesRequest?.getLanguagesList(), [LANGUAGE]);
	assert.equal(configs.length, 2);
});

/** `S2tClient.create` must build a wrapper without touching the network (lazy gRPC channel). */
runTest('create builds an S2tClient wired with bearer auth', (): void => {
	const config: ClientConfig = { host: 'localhost', port: '50051', secure: false, grpcCert: null };
	const client: S2tClient = S2tClient.create(config, new FakeAuthProvider());
	assert.ok(client instanceof S2tClient);
});
