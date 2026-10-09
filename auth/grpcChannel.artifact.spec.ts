// Copyright 2021-2026 ONDEWO GmbH
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

// auth/grpcChannel.js is the committed `npm run build:grpcChannel` output that npm consumers execute.
// grpcChannel.spec.ts runs against the test build of the same source; this pins that the committed file
// IS that build (it differs only by the source-map comment), which is why the c8 gate excludes it.

import { strict as assert } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it } from 'node:test';

describe('auth/grpcChannel.js', () => {
	it('is the tsc output of auth/grpcChannel.ts (run `npm run build:grpcChannel` after editing the source)', () => {
		const tested: string = readFileSync(join(__dirname, 'grpcChannel.js'), 'utf8').replace(
			/\n\/\/# sourceMappingURL=.*\n?$/,
			'\n'
		);
		const shipped: string = readFileSync(join(__dirname, '..', '..', 'auth', 'grpcChannel.js'), 'utf8');
		assert.equal(shipped, tested);
	});
});
