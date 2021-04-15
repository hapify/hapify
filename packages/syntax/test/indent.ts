import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';

const Model = readJSONSync(`${__dirname}/models/video.json`);

const Input = readFileSync(`${__dirname}/templates/indent.hpf`, 'utf8');
const Output = readFileSync(`${__dirname}/output/indent.txt`, 'utf8');

describe('indentation', () => {
	it('run', () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});
});
