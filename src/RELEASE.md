# Release History

*****************

## Release ONDEWO S2T Nodejs Client 7.6.2

### New Features

* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) Keycloak authentication with offline-token start-up, matching ondewo-s2t-client-python 7.6.2 (this release carries the python SDK's 7.6.1 and 7.6.2 Keycloak work at once, so every language shares one version for one feature set): the `refreshToken` option of the token provider, `getKeycloakTokenProvider()`, the lazy `getAuthorizationMetadata()` and `createGrpcClient({ tokenProvider })` / `createKeycloakCallCredentials()`, which attach `authorization: Bearer <token>` to every call.
* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) A handed-off Keycloak *offline* refresh token starts the client with one `grant_type=refresh_token` exchange, and the client then never sends a password grant, not even as a fallback; a refused token is never answered with a password login. A Keycloak config needs `password` OR `refresh_token`, all Keycloak fields are validated all-or-nothing, and the password and the token are redacted in every rendering.
* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) Resilient refresh: a failed refresh never ends the refresh loop; the proactive refresh and the per-call (lazy) refresh share one full-jitter backoff (5 s doubling to 300 s, measured from the recorded failure) and send no request while it runs; concurrent callers share one in-flight refresh. A still-valid token keeps being served while a refresh fails, and only an expired token raises `KeycloakAuthenticationError` (a `TokenError` carrying the cause).
* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) One shared provider per credential set, keyed by a SHA-256 of the credentials, so two configs of different tenants never share one. The token request has a 10 s timeout, quoted Keycloak error bodies are cut at 500 characters, and a token response is reported by its field names only, never its values.

### Bug Fixes

* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) A password login whose response carries no `refresh_token` is accepted and keeps the previous (empty) refresh token, as the python SDK does; a later refresh grant sends an empty `refresh_token` instead of the string `"null"`.
* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) The missing-`access_token` error lists the response's field names quoted (`['expires_in', 'refresh_token']`), as the python SDK does, and the shared-provider registry key renders `verify_ssl` as `True` / `False` like every other SDK.
* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) `refreshNow()` sends no request after `tokenExpirationInS` elapsed or while the shared backoff is pending, and rejects instead; it skips only the leeway window.

### Improvements

* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) Tests: the T01-T62 catalogue runs against the TypeScript source and the shipped CommonJS twin in `auth/`, with 100 % coverage.

API unchanged: tracking API Version [7.6.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.6.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.6.0

### Improvements

* Tracking API Version [7.6.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.6.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )
* [[OND236-120]](https://ondewo.atlassian.net/browse/OND236-120) Generated with ondewo-proto-compiler 5.17.0
  (protoc 35.1 with `protoc-gen-js` 3.21.4 and grpc-tools' `grpc_node_plugin` 1.13.1). New runtime floors:
  `@grpc/grpc-js ^1.14.7` and `google-protobuf` 3.21.4.

*****************

## Release ONDEWO S2T Nodejs Client 7.5.1

### Improvements

* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) New TLS / mutual TLS helper `auth/grpcChannel`, exported from the package root: `GrpcClientConfig`, `createChannelCredentials` and `createGrpcClient` build `@grpc/grpc-js` credentials and channel options from PEM **content** (`grpcCert`, `grpcClientCert`, `grpcClientKey`), never a file path. An empty `grpcCert` trusts the system roots. Same contract as the Python SDKs (ondewo-client-utils 4.1.x).
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Refused before gRPC sees them: half a client identity (certificate without key or key without certificate), a value that is not PEM content (e.g. a path), and `useSecureChannel: false` together with a client identity. Empty strings on both mean plain TLS. Error messages name the field and `host:port`, never a PEM, a key or the config object.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) A plaintext channel logs a warning naming `host:port`; bare IPv6 hosts are bracketed (`[::1]:50051`); CRLF PEMs work; the client key renders as `***REDACTED***` in `toString`, `util.inspect` and `JSON.stringify`.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Channel defaults: max message length `2**31 - 1` in both directions, `grpc.max_reconnect_backoff_ms` 5000, `grpc.keepalive_timeout_ms` 20000, `grpc.keepalive_permit_without_calls` 0. `grpc.keepalive_time_ms` is deliberately left unset: grpc-js has no `grpc.http2.max_pings_without_data`, so keepalive pings on a silent stream make a grpc-core server answer GOAWAY `too_many_pings`.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) README section "TLS, mutual TLS and certificates": modes, loading PEMs from files, a test PKI with openssl, security notes and troubleshooting.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Tests: real handshakes against an in-process grpc-js server with an openssl test PKI generated at test time (TLS, mutual TLS, missing or foreign client identity rejected, wrong CA, CRLF PEMs, IPv6 where available), plus the refusal and redaction cases. CI runs on Node 20, 22 and 24 with `npm ci`, and fails when the committed `auth/` build output drifts from its source.

### Bug Fixes

* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Regenerated with ondewo-proto-compiler 5.15.5: `public-api.js` (the package `main`) is now a CommonJS barrel, so `require('@ondewo/s2t-client-nodejs')` works. With earlier compilers it contained `export * from` lines and failed with `ERR_MODULE_NOT_FOUND`. CI now `require()`s the package root.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) RELEASE.md gains the missing 1.4.0 section (taken from its GitHub release).
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) `tests/releaseNotes.spec.ts` pins the release-notes slice: every heading's spelling, every section's `*****` separator, `src/RELEASE.md` == `RELEASE.md` and non-empty notes for the current version.

API unchanged: tracking API Version [7.5.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.5.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.5.0

### Improvements

* Tracking API Version [7.5.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.5.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.4.1

### Bug Fixes

* [[OND221-2830]](https://ondewo.atlassian.net/browse/OND221-2830) Regenerated with [ondewo-proto-compiler 5.13.0](https://github.com/ondewo/ondewo-proto-compiler/releases/tag/5.13.0).
* [[OND221-2830]](https://ondewo.atlassian.net/browse/OND221-2830) The hand-written `auth/` surface is now re-exported from the generated public-api barrel. It was compiled and shipped inside the package but nothing re-exported it, so importing a symbol from the package root did not resolve and consumers could only deep-import the module. The re-export is emitted by the compiler, so it survives the regeneration that rewrites the barrel on every build.
* [[OND221-2830]](https://ondewo.atlassian.net/browse/OND221-2830) Tooling: `conventional-pre-commit` now runs before `giticket` at the commit-msg stage - with giticket first, its `[OND221-2830] fix: ...` rewrite was no longer valid Conventional Commits and every commit on a ticket branch failed. `README.md` is prettier-ignored where `.prettierrc` sets `useTabs` and markdownlint's MD010 de-tabs the same blocks, and the codegen `docker run` invocations no longer pass `-it`, which fails outside a TTY.

*****************

## Release ONDEWO S2T Nodejs Client 7.4.0

### Improvements

* Tracking API Version [7.4.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.4.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.3.0

### Improvements

* Tracking API Version [7.3.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.3.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.2.0

### Improvements

* Tracking API Version [7.2.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.2.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.1.0

### Improvements

* Tracking API Version [7.1.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.1.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 7.0.0

### Improvements

* Tracking API Version [7.0.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/7.0.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 6.1.0

### Improvements

* Tracking API Version [6.1.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/6.1.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 6.0.0

### Improvements

* Tracking API Version [6.0.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/6.0.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 5.7.0

### Improvements

* Tracking API Version [5.7.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/5.7.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 5.6.0

### Improvements

* Tracking API Version [5.6.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/5.6.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 5.5.0

### Improvements

* Tracking API Version [5.5.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/5.5.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 5.4.0

### Improvements

* Tracking API Version [5.4.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/5.4.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 5.3.0

### Improvements

* Tracking API Version [5.3.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/5.3.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 5.2.0

### Improvements

* Tracking API Version [5.2.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/5.2.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 4.0.0

### Improvements

* Tracking API Version [4.0.0](https://github.com/ondewo/ondewo-s2t-api/releases/tag/4.0.0) ( [Documentation](https://ondewo.github.io/ondewo-s2t-api/) )

*****************

## Release ONDEWO S2T Nodejs Client 3.3.0

### Improvements

* Track version 3.3.0 of [ONDEWO S2T API](https://github.com/ondewo/ondewo-s2t-api/releases/3.3.0)
* [[OND211-2039]](https://ondewo.atlassian.net/browse/OND211-2039) - Implemented automated release for GitHub and NPM
* [[OND211-2039]](https://ondewo.atlassian.net/browse/OND211-2039) - Added pre-commit hooks and adjusted files to them

*****************

## Release ONDEWO S2T Nodejs Client 1.4.0

### New Features

* Added first public release
* Javascript and Typescript clients
* Uses version 1.4.0 from <a href="https://github.com/ondewo/ondewo-s2t-api">ONDEWO S2T APIs</a>

*****************
