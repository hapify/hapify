import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';

const Model = readJSONSync(`${__dirname}/models/video.json`);

const Input = readFileSync(`${__dirname}/templates/injection.hpf`, 'utf8');

describe('injection', () => {
	it('run', () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(() => HapifySyntax.run(Input, Model)).to.throw(Error);
	});
});
