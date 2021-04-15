import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { CommentPattern } from '../src/patterns/CommentPattern';

const Model = readJSONSync('./models/video.json');

const Input = readFileSync(`${__dirname}/templates/comment.hpf`, 'utf8');
const Output = readFileSync(`${__dirname}/output/comment.txt`, 'utf8');

describe('comment', () => {
	it('run', () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', () => {
		// Names
		expect(CommentPattern.execute('<<#this should be removed>>')).to.equal('');
		expect(CommentPattern.execute('This<<#this should be removed>> should be kept')).to.equal('This should be kept');
	});
});
