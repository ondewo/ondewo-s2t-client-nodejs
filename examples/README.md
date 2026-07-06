# Examples — ONDEWO S2T Client NodeJS

Minimal, idiomatic usage of `@ondewo/s2t-client-nodejs`.

- [`s2tClient.ts`](./s2tClient.ts) — a small promise-based wrapper around the
  generated `Speech2TextClient`. It attaches the current ONDEWO auth header
  (`authorization: Bearer <jwt>`) from the Keycloak offline-token provider
  ([`../auth/offlineTokenProvider.ts`](../auth/offlineTokenProvider.ts)) to every
  call, and exposes two representative RPCs: `getServiceInfo` and
  `listS2tPipelines`.
- [`getServiceInfo.ts`](./getServiceInfo.ts) — a runnable end-to-end script:
  log in via the offline-token flow, build the client, print the S2T server
  version.
- [`s2tClient.spec.ts`](./s2tClient.spec.ts) — mock-based tests that exercise the
  wrapper with the gRPC stub and the auth provider faked (no live server).

## Auth

Authentication follows the SDK's Keycloak bearer-token convention. Obtain an
`OfflineTokenProvider` via `OfflineTokenProvider.login({ ... })` and pass it to
`S2tClient.create(config, provider)`; the provider stamps a fresh
`authorization: Bearer <jwt>` header onto the gRPC metadata of every request.

## Run the mock tests (no server required)

```shell
npm run test:examples
```

## Type-check the examples

```shell
npm run typecheck:examples
```

## Run the end-to-end example (against a live server)

Configure the endpoint and technical-user credentials in
[`examples/environment.env`](./environment.env), which the example loads via
`dotenv` (path resolved relative to the script). The canonical variables are:

```shell
# Connection
ONDEWO_HOST=localhost
ONDEWO_PORT=50051
# Secure channel
ONDEWO_USE_SECURE_CHANNEL=false
ONDEWO_GRPC_CERT=
# Keycloak
KEYCLOAK_URL=https://keycloak.example.com/auth
KEYCLOAK_REALM=ondewo-ccai-platform
KEYCLOAK_CLIENT_ID=ondewo-nlu-cai-sdk-public
KEYCLOAK_USER_NAME=<technical-user>
KEYCLOAK_PASSWORD=<password>
KEYCLOAK_VERIFY_SSL=true
```

Then compile and run:

```shell
npx tsc examples/getServiceInfo.ts --outDir .run --module commonjs \
    --target es2020 --skipLibCheck --types node
node .run/getServiceInfo.js
```
