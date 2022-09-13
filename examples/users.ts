import * as grpc from '@grpc/grpc-js';
import { LoginRequest, LoginResponse } from '../api/ondewo/nlu/user_pb';
import { UsersClient } from '../api/ondewo/nlu/user_grpc_pb';
import { ClientConfig } from './njs-client';

export class UserService {
	private usersClient: UsersClient;
	public nlu_token: string = '';
	public metadata: grpc.Metadata = new grpc.Metadata();
	public constructor(config: ClientConfig, use_secure_channel: boolean) {
		if (!use_secure_channel) {
			this.usersClient = new UsersClient(`${config.host}:${config.port}`, grpc.credentials.createInsecure());
			this.metadata.set('cai-token', '');
			this.metadata.set('authorization', config.http_token);
		} else {
			this.usersClient = new UsersClient(`${config.host}:${config.port}`, grpc.credentials.createSsl(config.grpc_cert));
			this.metadata.set('cai-token', '');
			this.metadata.set('authorization', config.http_token);
		}
	}

	public login(user_name: string, password: string): Promise<grpc.ClientUnaryCall> {
		const request: LoginRequest = new LoginRequest();
		request.setPassword(password);
		request.setUserEmail(user_name);

		return new Promise((resolve: any) => {
			this.usersClient.login(request, (error: grpc.ServiceError, response: LoginResponse) => {
				if (error) console.log(error);
				this.nlu_token = response.getAuthToken();
				this.metadata.set('cai-token', this.nlu_token);
				resolve(this.nlu_token);
			});
		});
	}
}
