import * as Fs from 'fs';
import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';
import { EvaluatePattern } from '../src/patterns/evaluate';

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/templates/evaluate.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/evaluate.txt`, 'utf8');

describe('evaluate', () => {
	it('run', async () => {
		//Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', async () => {
		// Names
		expect(EvaluatePattern.execute('<<<this should be there>>>')).to.equal('`;\nthis should be there\nout += `');
		expect(EvaluatePattern.execute('<<<[   this should be there with spaces    ]>>>')).to.equal('`;\n[   this should be there with spaces    ]\nout += `');
	});
});
