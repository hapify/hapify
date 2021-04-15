import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { EscapeBackSlashesPattern } from '../src/patterns/EscapeBackSlashesPattern';
import { EscapePattern } from '../src/patterns/EscapePattern';

const Model = readJSONSync('./models/video.json');

const Input = readFileSync(`${__dirname}/templates/escape.hpf`, 'utf8');
const Output = readFileSync(`${__dirname}/output/escape.txt`, 'utf8');

describe('escape', () => {
	it('run', () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', () => {
		expect(EscapePattern.execute('\\<\\<should\\>\\>')).to.equal('<<should>>');
		expect(EscapePattern.execute('<\\<\\<should>\\>\\>')).to.equal('<<<should>>>');
	});

	it('unit back-slashes', () => {
		expect(EscapeBackSlashesPattern.execute('\\')).to.equal('\\\\');
		expect(EscapeBackSlashesPattern.execute('\\\n')).to.equal('\\\\\n');
		expect(EscapeBackSlashesPattern.execute('\\\\')).to.equal('\\\\\\\\');
		expect(EscapeBackSlashesPattern.execute('\\\\\n')).to.equal('\\\\\\\\\n');
	});
});
