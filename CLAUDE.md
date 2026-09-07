# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working Principles

Behavioral guidelines to reduce common mistakes. They bias toward caution over speed; for trivial tasks, use judgment.

### Think before coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity first

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that _your_ changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### Goal-driven execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and
clarifying questions come before implementation rather than after mistakes.

## Git Commits

- **Never include Claude as author or co-author** in commit messages, PR descriptions, or any other text. Do not add
  `Co-Authored-By: Claude…` trailers, "Generated with Claude Code" footers, or any similar attribution.
- The user's own git author identity (already configured in git) is the only identity that should appear on commits.
- This rule overrides the default Claude Code commit-template guidance.
- **Never prepend the JIRA ticket ID** (e.g. `[OND211-2386]`) to the commit subject yourself. The `giticket` pre-commit
  hook reads the ticket from the branch name (`(feature|bugfix|support|hotfix)/<TICKET>-…`) and prepends `[<ticket>]`
  (with a trailing space) automatically. Writing the prefix manually produces a duplicate like
  `[OND211-2386] [OND211-2386] feat: …`. Write the subject as plain Conventional Commits (`feat: …`, `fix(scope): …`,
  `docs(types): …`) and let the hook add the prefix on commit.

## General Principles

- Follow existing patterns before introducing new abstractions.
- Keep changes minimal and consistent with surrounding code.
- Validate inputs early with descriptive, context-rich error messages.
- Use context managers for files, sockets, and thread pools.
- Prefer region comments for grouping methods in files that already use them.
- End edited Markdown and YAML files with a trailing newline.

## What this repo is

`@ondewo/s2t-client-nodejs` — the Node gRPC SDK for the ONDEWO S2T API. About 95% of the tracked
code is **generated** and must never be hand-edited:

| Path | Kind |
| --- | --- |
| `api/` | generated protobuf/gRPC stubs (`speech-to-text*_pb`, `empty*`, `struct*`) |
| `public-api.js`, `public-api.d.ts` | generated barrel re-exporting `api/` |
| `src/ondewo-s2t-api/` | submodule: the `.proto` source |
| `ondewo-proto-compiler/` | submodule: the codegen docker image |
| `auth/offlineTokenProvider.ts` | **hand-written** — the D18 Keycloak offline-token provider |
| `auth/offlineTokenProvider.js`, `.d.ts` | **hand-maintained** CommonJS twin + typings shipped to npm |
| `examples/s2tClient.ts`, `examples/getServiceInfo.ts` | **hand-written** examples |

Toolchain: node 24 locally / node 20 in CI, typescript 6.0.3, c8 11.0.0, node's built-in
`node:test` runner. There is no jest and no `tsconfig`-driven build for the tests — every test
script drives `tsc` with explicit flags and `--ignoreConfig`.

**`auth/offlineTokenProvider.js` and `.d.ts` are NOT `tsc` output.** They are hand-maintained
ES5-style CommonJS twins (tab-indented, prettier-formatted, licence header, `module.exports = {...}`).
`npm run build:auth` regenerates them from the `.ts` and produces a ~390-line diff, so **do not run
it to "sync"** — edit all three files by hand and keep them semantically identical. The `.js` twin
is what npm consumers actually execute (`make create_npm_package` copies `auth/` wholesale), so
`npm test` runs the whole behavioural suite against BOTH files and the c8 gate measures both —
see below. `.d.ts` is the one member of the trio no test executes; the parity case at the end of
`offlineTokenProvider.spec.ts` compares only the two runtime surfaces.

## Tests and the coverage gate

```shell
npm test                    ## build:tests + node:test + the c8 gate   <- the CI gate
npm run typecheck:examples  ## strict --noEmit type-check of examples/*.ts
npm run test:examples       ## just the example specs (subset of npm test)
npm run test:drift          ## package.json <-> .ci-package.json mirror guard
make eslint                 ## type-aware lint (warnings are tolerated, errors are not)
make prettier               ## format check; PRETTIER_WRITE=-w to apply
```

`build:tests` compiles `auth/*.ts examples/*.ts` into `.test-build/{auth,examples}/`, symlinks
`.test-build/api -> ../api` (the examples import `../api/...`) and asserts the three expected
outputs exist, so a silently empty build fails instead of vacuously passing.

The gate is the `test` script in `package.json`, quoted here verbatim (`node -e
"console.log(require('./package.json').scripts.test)"` prints it):

```shell
c8 --check-coverage --statements 100 --lines 100 --branches 100 --functions 100 \
  --temp-directory .test-build/.c8 --all --src .test-build --src auth \
  --include '.test-build/auth/**/*.js' --include '.test-build/examples/**/*.js' \
  --include 'auth/**/*.js' --exclude '**/*.spec.js' \
  --reporter text node --test .test-build/*/*.spec.js
```

- **`--all` + directory globs are the point.** With the old single-file `--include
  '**/offlineTokenProvider.js'` the gate failed OPEN: a new untested hand-written file was simply
  not measured. Verified after the change by dropping a trivial `examples/untestedProbe.ts` into the
  tree — the run went red (`untestedProbe.ts 0% | 1-3`). Keep `--all` and keep the globs
  directory-shaped.
- **`--src auth` + `--include 'auth/**/*.js'` are what make the gate see the HAND-WRITTEN `.js`.**
  `--src` is the directory list `--all` walks; with `.test-build` as the only entry the gate could
  only ever measure `tsc` output, so `auth/offlineTokenProvider.js` — the file npm ships — was
  invisible and an untested `auth/*.js` was silently ignored (measured: an `auth/untestedTwin.js`
  probe left the report at `All files | 100 | 100 | 100 | 100`, exit 0). With both `--src` entries
  the same probe turns the run red (`untestedTwin.js | 0 | 0 | 0 | 0 | 1-3`, exit 1). Do not drop
  either flag.
- **The behavioural suite is run twice.** `offlineTokenProvider.spec.ts` wraps every case in
  `runProviderSuite(implementation, mod)` and calls it with the compiled `.ts` and with the twin
  `require`d from the repo root (`resolvePath(__dirname, '..', '..', 'auth', ...)`) — 17 cases each,
  named `ts: …` / `js: …`, plus one shape-parity case. Verified by mutating the twin ALONE:
  `authorization` → `Authorization` fails `js: applyToMetadata …`; `rejectUnauthorized: false` →
  `true` fails `js: keycloakVerifySsl false …` and the parity case; an extra prototype method fails
  the parity case. Before this, an edit to the twin was caught by nothing.
- Coverage is source-mapped back to the `.ts` (hence `--sourceMap` in `build:tests`); the twin has
  no source map, so it is reported as `auth/offlineTokenProvider.js` in its own right.
- **eslint deliberately still ignores `auth/offlineTokenProvider.{js,d.ts}`.** They are ES5-style by
  design (`var`, no annotations) and the repo's type-aware ruleset (`no-var`, `typedef`,
  `explicit-function-return-type`) would report them as errors, failing `make eslint`. Their guards are
  prettier (format), the `js:` suite (behaviour), c8 (coverage) and the parity case (shape).
- **There is exactly ONE `c8 ignore` in the repo**: the `require.main === module` direct-run
  entrypoint at the bottom of `examples/getServiceInfo.ts`, which cannot execute in-process because
  the spec imports the module. Every other "defensive" ignore that used to sit in
  `offlineTokenProvider.ts` was deleted and replaced with a real test (stopped-provider
  `refreshNow`, the negative-delay clamp, the still-open bounded-window clamp, the swallowed
  background-refresh rejection, and an unreadable error body). Do not reintroduce blanket ignores.
- `INSECURE_AGENT_OPTIONS` in `auth/offlineTokenProvider.ts` exists so the security-relevant
  `rejectUnauthorized: false` literal is pinned by an assertion. Flipping it to `true` makes
  `npm test` exit 1 (verified) — an `instanceof Agent` assertion alone would not have noticed.
- `examples/getServiceInfo.ts` takes its two outside-world boundaries (`loginImpl`, `createClient`)
  as injectable overrides that default to the real ones. `main()` called with NO overrides resolves
  both defaults at the top and then fails at the mocked Keycloak call, which is how the `??`
  right-hand branches get covered without any network.

## CI: `.github/workflows/tests.yml`

Single job, ubuntu-latest, node 20, no submodules (the `ondewo-proto-compiler` gitlink uses an SSH
URL a runner cannot clone; the tests only need the committed `api/`). Steps, in order — each one is
a hard gate:

1. `npm install --no-audit --no-fund`
2. `npm run test:drift` — package.json vs `.ci-package.json`
3. `npm test` — the 100% coverage gate
4. `npm run typecheck:examples && npm run test:examples`
5. `make eslint`
6. `npx prettier --config .prettierrc --check --ignore-path .prettierignore ./`

What turns it red in practice: a new hand-written file under `auth/`/`examples/` with no test (a
`.js` there as much as a `.ts`); a behavioural edit to the `auth/offlineTokenProvider.js` twin that
the `.ts` did not get; a test script edited in `package.json` but not `.ci-package.json` (or vice
versa); an eslint _error_
(warnings such as `no-ternary` / `no-mixed-operators` are pre-existing and tolerated); a file
prettier wants to reformat that is not listed in `.prettierignore`.

## `.prettierignore` is release-critical

`.husky/pre-commit` runs `make prettier PRETTIER_WRITE=-w`, i.e. prettier **writes** on every
commit. Two entries exist to stop that from breaking things and must not be removed:

- **`README.md`** — prettier rewrites the link-reference title `[comment]: <> (START OF GITHUB
  README)` into `[comment]: <> 'START OF GITHUB README'`. `make build` slices the published README
  between those markers: it computes the line range from `src/README.md` and applies it to
  `npm/README.md`, which is a copy of the ROOT `README.md`. Once prettier had desynchronised the two
  (130 vs 122 lines), the release cut the wrong range — the published README ended on an unclosed
  ``` fence and still carried the GitHub-only release section. **Invariant: `diff README.md
  src/README.md` must be empty**, and `make build` enforces it by doing `cp src/README.md .`.
- **`.pre-commit-config.yaml`, `.markdownlint-cli2.yaml`, `.ci-package.json`, `CLAUDE.md`** —
  prettier reformatting the pre-commit config mid-commit makes the very next `pre-commit run` abort
  with _"Your pre-commit configuration is unstaged"_.
- `coverage/` and `.nyc_output/` are gitignored but `prettier -w ./` would still rewrite them.

## pre-commit

Hooks: markdownlint-cli2 `v0.23.2`, pre-commit-hooks `v6.0.0`, conventional-pre-commit `v4.4.0`,
giticket `'1.92'` (keep it quoted — unquoted `1.92` is a YAML float). Those last three are already
the newest stable; conventional-pre-commit's only newer tags are `-preN` pre-releases of
already-released versions — never accept one from `pre-commit autoupdate`.

Run it as `uvx pre-commit run --all-files` (`pre-commit` is not on PATH here). It is green.

- **ORDER MATTERS: conventional-pre-commit MUST be declared before giticket.** Both run at the
  commit-msg stage and pre-commit executes repos in declaration order. giticket rewrites the subject
  to `[OND231-624] chore: probe`, which is no longer valid Conventional Commits. Measured on a
  `feature/OND231-624-…` branch: with giticket first the hook fails with _"[Bad commit message] >>
  [OND231-624] chore: probe"_ (exit 1); with the order fixed, `Conventional Commit ... Passed` then
  `giticket ... Passed` and the subject becomes `[OND231-624] chore: probe`.
- **`require_serial: true` on markdownlint-cli2 is load-bearing.** Without it pre-commit splits the
  markdown files across parallel workers, and because `.markdownlint-cli2.yaml` declares
  `globs: ["*.md"]` **every** worker also expands that glob and `--fix`-writes the same root `*.md`
  files. The interleaved writes corrupt them. Measured A/B on this repo (128 CPUs): parallel →
  `RELEASE.md` kept only 8 of its 16 `## Release ONDEWO S2T Nodejs Client <VERSION>` headings and
  lost single characters (`ONDEW S2T`, `Tracking API Vesion`, `gihub.com`); serial → one process,
  6 files, byte-clean. markdownlint-cli2 invoked directly (one process) is clean at both v0.23.0 and
  v0.23.2, so the version is not the trigger — the parallelism is.
- **markdownlint MD053 stays disabled** in `.markdownlint-cli2.yaml`. Its auto-fix DELETES the
  `[comment]: <> (…)` reference definitions the README slice depends on.
- MD012/MD022/MD032/MD005 auto-fixes on `RELEASE.md` are content-safe: they only strip trailing
  whitespace, normalise blank lines and unindent the `*` bullets. The `## Release …` headings and
  the `*****` separators the release Makefile greps for survive — verified by diffing the file with
  whitespace and blank lines normalised away.
- `.husky/pre-commit` still guards `pre-commit run` behind `git diff --quiet --
  .pre-commit-config.yaml`. That guard is now belt-and-braces rather than essential: the config is
  in `.prettierignore`, so `make prettier -w` no longer dirties it.
- `.husky/pre-push` runs `npm test` and **skips itself for the three release pushes** (`refs/tags/*`,
  `refs/heads/release/*`, and a commit whose subject starts `Preparing for Release`), which
  `make release` performs without `--no-verify`.

## The proto-compiler pin

`ondewo-proto-compiler` is pinned **twice** and both must agree:

- the submodule gitlink — currently `b71f8ed` = tag `5.14.0`
- `ONDEWO_PROTO_COMPILER_GIT_BRANCH=tags/5.14.0` in the `Makefile`, which
  `check_out_correct_submodule_versions` checks out during `make build`

They had drifted (`Makefile` at `tags/5.10.0`, gitlink at `5.11.0`), so `make build` actively
_downgraded_ the submodule. To bump:

```shell
git submodule update --init --recursive
git -C ondewo-proto-compiler fetch --tags origin
git -C ondewo-proto-compiler checkout <VERSION>
perl -i -pe 's|^ONDEWO_PROTO_COMPILER_GIT_BRANCH=.*|ONDEWO_PROTO_COMPILER_GIT_BRANCH=tags/<VERSION>|' Makefile
git add ondewo-proto-compiler Makefile
```

Nothing else changes: the `jq` dependency sync from
`ondewo-proto-compiler/nodejs/image-data/package.json` into `src/package.json` is a **no-op** here
(`@types/node` already `^22.15.27`, `grpc_tools_node_protoc_ts` not declared), and
`Dockerfile.utils` already carries `ENV NODE_VERSION=24.14.0`, which is what 5.14.0 declares.

**A pin is not a regeneration.** 5.12.0/5.13.0/5.14.0 are Angular/JS/Node/TS _codegen_ fixes —
notably `append-auth-exports.sh` (5.13.0), which would re-export `auth/` from `public-api.d.ts`
(this repo's `public-api.d.ts` still exports no auth module). Moving the pin changes which image
`make build` would build; it rewrites no committed stub. Never write "Regenerated with
ondewo-proto-compiler X" in `RELEASE.md` unless `make build` actually ran.

## Release

`make ondewo_release` → `spc` → clone devops-accounts → `make release`. Notes worth knowing:

- `create_npm_package` copies `auth/` wholesale, then `rm -f npm/auth/*.spec.* npm/auth/*.test.*`
  and writes `npm/.npmignore` with the same two patterns. The published tarball is `./npm`, so the
  **root `.npmignore` is never consulted**. `make create_npm_package && (cd npm && npm pack
  --dry-run) | grep -c spec` must print `0`.
- The release commit line is `-git commit --no-verify …`. The leading `-` matters: when `make build`
  produced no changes the bare form aborts the whole release on git's non-zero "nothing to commit".
- `make TEST` prints `<set>`/`<unset>` instead of `GITHUB_GH_TOKEN` / `NPM_PASSWORD`; every
  token-bearing `docker run`/`make release $(info)` recipe line is `@`-prefixed. Keep it that way.
- `CURRENT_RELEASE_NOTES` slices `RELEASE.md` from `Release ONDEWO S2T Nodejs Client <VERSION>` to
  the next line containing `**`, which is the `*****` separator. `make TEST` prints exactly what a
  GitHub release would get — use it before releasing.
- **`RELEASE.md` is the authoritative changelog and the release tag holds the complete history.**
  A careless markdown pass can drop `## Release … X.Y.Z` headings (see `require_serial` above); if
  that happens, restore `RELEASE.md` **and** `src/RELEASE.md` from the latest release tag.
- The release codegen regenerates the ROOT `package.json`, wiping the test scripts and test-only
  devDeps. `.ci-package.json` holds them and `make restore_ci_test_setup` merges them back inside
  `make build`. It is an inline `node -e` on purpose — a helper `.js` file gets caught by the
  release's type-checked eslint and fails the release. `npm run test:drift` is the guard that the
  two copies still agree.
