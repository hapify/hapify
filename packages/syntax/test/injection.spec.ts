import * as Fs from 'fs';
import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/templates/injection.hpf`, 'utf8');

describe('injection', () => {
	it('run', async () => {
		//Test input validity
		expect(Input).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(() => HapifySyntax.run(Input, Model)).to.throw(Error);
	});
});
