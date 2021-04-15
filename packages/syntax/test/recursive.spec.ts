import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';

describe('recursive', () => {
	it('unit', async () => {
		expect(HapifySyntax.run('out = `Joi.array().items(${out})`;', {})).to.equal('out = `Joi.array().items(${out})`;');
		expect(HapifySyntax.run('<<< const value = 1; out = `Joi.array().items(${value})`;>>>', {})).to.equal('Joi.array().items(1)');
	});
});
