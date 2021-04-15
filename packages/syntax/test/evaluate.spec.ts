import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { EvaluatePattern } from '../src/patterns/evaluate';

const Model = readJSONSync('./models/video.json');

const Input = readFileSync(`${__dirname}/templates/evaluate.hpf`, 'utf8');
const Output = readFileSync(`${__dirname}/output/evaluate.txt`, 'utf8');

describe('evaluate', () => {
	it('run', () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', () => {
		// Names
		expect(EvaluatePattern.execute('<<<this should be there>>>')).to.equal('`;\nthis should be there\nout += `');
		expect(EvaluatePattern.execute('<<<[   this should be there with spaces    ]>>>')).to.equal('`;\n[   this should be there with spaces    ]\nout += `');
	});
});
