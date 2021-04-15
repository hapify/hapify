import * as Fs from 'fs';

import { expect } from '@hapi/code';

import 'mocha';
import { HapifySyntax } from '../src';

const Model = require('./models/video.json');

const Input = Fs.readFileSync(`${__dirname}/templates/indent.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/indent.txt`, 'utf8');

describe('indentation', () => {
	it('run', async () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});
});
