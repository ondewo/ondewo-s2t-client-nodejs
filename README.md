<div align="center">
  <table>
    <tr>
      <td>
        <a href="https://ondewo.com/en/products/natural-language-understanding/">
            <img width="400px" src="https://raw.githubusercontent.com/ondewo/ondewo-logos/master/ondewo_we_automate_your_phone_calls.png"/>
        </a>
      </td>
    </tr>
    <tr>
       <td align="center">
          <a href="https://www.linkedin.com/company/ondewo "><img width="40px" src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"></a>
          <a href="https://www.facebook.com/ondewo"><img width="40px" src="https://cdn-icons-png.flaticon.com/512/733/733547.png"></a>
          <a href="https://twitter.com/ondewo"><img width="40px" src="https://cdn-icons-png.flaticon.com/512/733/733579.png"> </a>
          <a href="https://www.instagram.com/ondewo.ai/"><img width="40px" src="https://cdn-icons-png.flaticon.com/512/174/174855.png"></a>
          <a href="https://badge.fury.io/js/%40ondewo%2Fs2t-client-nodejs"><img src="https://badge.fury.io/js/%40ondewo%2Fs2t-client-nodejs.svg" alt="npm version" height="32"></a>
       </td>
    </tr>
  </table>
  <h1 align="center">
    ONDEWO S2T Client NodeJS
  </h1>
</div>

## Overview

`@ondewo/s2t-client-nodejs` is a compiled version of the [ONDEWO S2T API](https://github.com/ondewo/ondewo-s2t-api) using the [ONDEWO PROTO COMPILER](https://github.com/ondewo/ondewo-proto-compiler). Here you can find the S2T API [documentation](https://ondewo.github.io).

ONDEWO APIs use [Protocol Buffers](https://github.com/google/protobuf) version 3 (proto3) as their Interface Definition Language (IDL) to define the API interface and the structure of the payload messages. The same interface definition is used for gRPC versions of the API in all languages.

## Setup

Using NPM:

```shell
npm i --save @ondewo/s2t-client-nodejs
```

Using GitHub:

```shell
git clone https://github.com/ondewo/ondewo-s2t-client-nodejs.git ## Clone repository
cd ondewo-s2t-client-nodejs                                      ## Change into repo-directoy
make setup_developer_environment_locally                         ## Install dependencies
```

## Package structure

```
npm
├── api
│   ├── google
│   │   └── protobuf
│   │       ├── empty_grpc_pb.js
│   │       ├── empty_pb.d.ts
│   │       ├── empty_pb.js
│   │       ├── struct_grpc_pb.js
│   │       ├── struct_pb.d.ts
│   │       └── struct_pb.js
│   └── ondewo
│       └── s2t
│           ├── speech-to-text_grpc_pb.d.ts
│           ├── speech-to-text_grpc_pb.js
│           ├── speech-to-text_pb.d.ts
│           └── speech-to-text_pb.js
├── auth
│   ├── offlineTokenProvider.d.ts
│   ├── offlineTokenProvider.js
│   └── offlineTokenProvider.ts
├── LICENSE
├── package.json
├── public-api.d.ts
├── public-api.js
└── README.md
```

## Authentication

Every request carries an `authorization: Bearer <jwt>` header sourced from the Keycloak
offline-token provider shipped in `auth/`:

```js
const { login } = require('@ondewo/s2t-client-nodejs/auth/offlineTokenProvider');

const provider = await login({
  keycloakUrl: 'https://keycloak.example.com/auth',
  realm: 'ondewo-ccai-platform',
  clientId: 'ondewo-nlu-cai-sdk-public',
  username: '<technical-user>',
  password: '<password>'
});
// provider.applyToMetadata(metadata) stamps the header onto any gRPC Metadata object.
// Always provider.stop() when done -- it clears the background refresh timer.
```

Set `keycloakVerifySsl: false` to skip TLS certificate verification on the token request only
(opt-in insecure, for a self-signed local Envoy).

[comment]: <> (START OF GITHUB README)

## Build

The `make build` command is dependent on 2 `repositories` and their speciefied `version`:

- [ondewo-s2t-api](https://github.com/ondewo/ondewo-s2t-api) -- `S2T_API_GIT_BRANCH` in `Makefile`
- [ondewo-proto-compiler](https://github.com/ondewo/ondewo-proto-compiler) -- `ONDEWO_PROTO_COMPILER_GIT_BRANCH` in `Makefile`

Other than creating the proto-code, `build` also installs the `dev-dependencies` and changes the owner of the proto-code-files from `root` to the `current user`.

In the case that some `google .protos` were not automatically generated, exists the option of creating a `proto-deps.txt` inside of the `src` folder. There, import statements can be written the same way as they are in `.proto` files.

  ```
  import "google/api/http.proto"; //Example
    <---- New Line
  ```

> :warning: The last line in the `proto-deps.txt` needs to be an empty new line, otherwise the compiler will fail

## GitHub Repository - Release Automation

The repository is published to GitHub and NPM by the Automated Release Process of ONDEWO.

TODO after PR merge:

- checkout master

  ```shell
  git checkout master
  ```

- pull newest state

  ```shell
  git pull
  ```

- Adjust `ONDEWO_S2T_VERSION` in the `Makefile` <br><br>
- Add new Release Notes to `src/RELEASE.md` in following format:

  ```
  ## Release ONDEWO S2T Nodejs Client X.X.X    <----- Beginning of Notes

  ...<NOTES>...

  *****************                             <----- End of Notes
  ```

- release

  ```shell
  make ondewo_release
  ```

<br>
The release process can be divided into 6 Steps:

1. `build` specified version of the `ondewo-s2t-api`
2. `commit and push` all changes in code resulting from the `build`
3. Publish the created `npm` folder to `npmjs.com`
4. Create and push the `release branch` e.g. `release/1.3.20`
5. Create and push the `release tag` e.g. `1.3.20`
6. Create a new `Release` on GitHub

> :warning:  The Release Automation checks if the build has created all the proto-code files, but it does not check the code-integrity. Please build and test the generated code prior to starting the release process.

## Development

Everything below runs without a live S2T server or Keycloak; see [`CLAUDE.md`](./CLAUDE.md) for the
detailed toolchain notes.

```shell
npm test                      ## compile + run every test under the 100% coverage gate
npm run typecheck:examples    ## strict --noEmit type-check of examples/
npm run test:drift            ## package.json <-> .ci-package.json mirror guard
make eslint                   ## type-aware lint
make prettier                 ## format check (add PRETTIER_WRITE=-w to fix)
uvx pre-commit run --all-files
```

`npm test` gates the hand-written surface -- `auth/offlineTokenProvider.ts`, its shipped CommonJS
twin `auth/offlineTokenProvider.js`, `examples/s2tClient.ts` and `examples/getServiceInfo.ts` -- at
**100% statements, branches, functions and lines**, with `c8 --all`, so a new `.ts` or `.js` file
under `auth/` or `examples/` that no test touches fails the build. The generated `api/` stubs are
excluded.

`.husky/pre-commit` runs eslint + prettier + `pre-commit run`; `.husky/pre-push` runs `npm test`
(and skips itself for the release pushes). Install them with `make install_precommit_hooks`.

[comment]: <> (END OF GITHUB README)
