import * as Fs from 'fs';
import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';
import { EscapePattern } from '../src/patterns/escape';
import { EscapeBackSlashesPattern } from '../src/patterns/escape-back-slashes';

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/templates/escape.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/escape.txt`, 'utf8');

describe('escape', () => {
	it('run', async () => {
		//Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', async () => {
		expect(EscapePattern.execute('\\<\\<should\\>\\>')).to.equal('<<should>>');
		expect(EscapePattern.execute('<\\<\\<should>\\>\\>')).to.equal('<<<should>>>');
	});

	it('unit back-slashes', async () => {
		expect(EscapeBackSlashesPattern.execute('\\')).to.equal('\\\\');
		expect(EscapeBackSlashesPattern.execute('\\\n')).to.equal('\\\\\n');
		expect(EscapeBackSlashesPattern.execute('\\\\')).to.equal('\\\\\\\\');
		expect(EscapeBackSlashesPattern.execute('\\\\\n')).to.equal('\\\\\\\\\n');
	});
});
