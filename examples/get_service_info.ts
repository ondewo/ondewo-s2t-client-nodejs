import { NJSClient } from './njs-client';
import * as dotenv from 'dotenv';
import { ClientConfig } from './njs-client';
import * as fs from 'fs';

dotenv.config({
	path: `${process.cwd()}/examples/examples.env`
});

// INSECURE CONNECTION

const config: ClientConfig = {
	host: process.env.EXAMPLES_HOST || '',
	port: process.env.EXAMPLES_PORT || '',
	http_token: process.env.EXAMPLES_HTTP_TOKEN || '',
	user_name: process.env.EXAMPLES_USER_NAME || '',
	password: process.env.EXAMPLES_PASSWORD || '',
	grpc_cert: null
};

console.log(`HOST: ${config.host}:${config.port}`);

const client: NJSClient = new NJSClient(config, false);

client.getServiceInfo();

// SECURE CONNECTION

// config = {
// 	host: process.env.EXAMPLES_HOST_SECURE || '',
// 	port: process.env.EXAMPLES_PORT_SECURE || '',
// 	http_token: process.env.EXAMPLES_HTTP_TOKEN_SECURE || '',
// 	user_name: process.env.EXAMPLES_USER_NAME_SECURE || '',
// 	password: process.env.EXAMPLES_PASSWORD_SECURE || '',
// 	grpc_cert: fs.readFileSync(`${process.cwd()}/examples/grpc_cert.txt`)
// };

// console.log(`HOST: ${config.host}:${config.port}`);
// console.log(config);

// client = new NJSClient(config, true);

// client.getServiceInfo();
