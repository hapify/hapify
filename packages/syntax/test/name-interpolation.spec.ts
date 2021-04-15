import * as Fs from 'fs';

import { expect } from '@hapi/code';

import 'mocha';
import { HapifySyntax } from '../src';
import { NameInterpolationPattern } from '../src/patterns/name-interpolation';

const Model = require('./models/video.json');

const Input = Fs.readFileSync(`${__dirname}/templates/name-interpolation.hpf`, 'utf8');
const InputError = Fs.readFileSync(`${__dirname}/templates/name-interpolation-error.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/name-interpolation.txt`, 'utf8');
const OutputError = Fs.readFileSync(`${__dirname}/output/name-interpolation-error.txt`, 'utf8');

describe('name interpolation', () => {
	it('run', async () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('error', async () => {
		// Test malformed shortcode
		expect(InputError).to.be.a.string();
		expect(OutputError).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(InputError, Model)).to.equal(OutputError);
	});

	it('unit', async () => {
		// Names
		expect(NameInterpolationPattern.execute('<<M aA>>')).to.equal('${root.names.camel}');
		expect(NameInterpolationPattern.execute('<<M AA>>')).to.equal('${root.names.pascal}');
		expect(NameInterpolationPattern.execute('<<M a>>')).to.equal('${root.names.lower}');
		expect(NameInterpolationPattern.execute('<<M A>>')).to.equal('${root.names.capital}');
		expect(NameInterpolationPattern.execute('<<M a-a>>')).to.equal('${root.names.kebab}');
		expect(NameInterpolationPattern.execute('<<M a_a>>')).to.equal('${root.names.snake}');
		expect(NameInterpolationPattern.execute('<<M aa>>')).to.equal('${root.names.compact}');
		expect(NameInterpolationPattern.execute('<<M R>>')).to.equal('${root.names.raw}');
		// Variable
		expect(NameInterpolationPattern.execute('<<f aA>>')).to.equal('${f.names.camel}');
		// Spaces
		expect(NameInterpolationPattern.execute('<<f   aA>>')).to.equal('${f.names.camel}');

		// Primary field
		expect(NameInterpolationPattern.execute('<<P aA>>')).to.equal('${root.fields.primary.names.camel}');

		// Sub field
		expect(NameInterpolationPattern.execute('<<root.fields.primary aA>>')).to.equal('${root.fields.primary.names.camel}');
	});
});
