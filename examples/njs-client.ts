import * as grpc from '@grpc/grpc-js';
import { Speech2TextClient } from '../api/ondewo/s2t/speech-to-text_grpc_pb';
import { S2TGetServiceInfoResponse } from '../api/ondewo/s2t/speech-to-text_pb';
import { Empty } from '../api/google/protobuf/empty_pb';

export class ClientConfig {
	public host: string = '';
	public port: string = '';
	public http_token: string = '';
	public grpc_cert: Buffer | null = null;
	public user_name: string = '';
	public password: string = '';
}

export class NJSClient {
	private speech2TextClient: Speech2TextClient;
	private config: ClientConfig;

	public constructor(config: ClientConfig, use_secure_channel: boolean) {
		if (!use_secure_channel) {
			this.speech2TextClient = new Speech2TextClient(
				`${config.host}:${config.port}`,
				grpc.credentials.createInsecure()
			);
			this.config = config;
		} else {
			this.speech2TextClient = new Speech2TextClient(
				`${config.host}:${config.port}`,
				grpc.credentials.createSsl(config.grpc_cert)
			);
			this.config = config;
		}
	}

	public getServiceInfo(): void {
		this.speech2TextClient.getServiceInfo(
			new Empty(),
			(error: grpc.ServiceError, response: S2TGetServiceInfoResponse) => {
				console.log('LIST ALL AGENTS:');
				if (error) console.log(error);
				console.log(response);
			}
		);
	}
}
