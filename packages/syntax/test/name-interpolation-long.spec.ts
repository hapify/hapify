import * as Fs from 'fs';
import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';
import { NameInterpolationPattern } from '../src/patterns/name-interpolation';

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/templates/name-interpolation-long.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/name-interpolation.txt`, 'utf8');

describe('name interpolation long', () => {
	it('run', async () => {
		//Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', async () => {
		// Names
		expect(NameInterpolationPattern.execute('<<Model camel>>')).to.equal('${root.names.camel}');
		expect(NameInterpolationPattern.execute('<<Model pascal>>')).to.equal('${root.names.pascal}');
		expect(NameInterpolationPattern.execute('<<Model lower>>')).to.equal('${root.names.lower}');
		expect(NameInterpolationPattern.execute('<<Model capital>>')).to.equal('${root.names.capital}');
		expect(NameInterpolationPattern.execute('<<Model kebab>>')).to.equal('${root.names.kebab}');
		expect(NameInterpolationPattern.execute('<<Model snake>>')).to.equal('${root.names.snake}');
		expect(NameInterpolationPattern.execute('<<Model compact>>')).to.equal('${root.names.compact}');
		expect(NameInterpolationPattern.execute('<<Model raw>>')).to.equal('${root.names.raw}');
		// Variable
		expect(NameInterpolationPattern.execute('<<f camel>>')).to.equal('${f.names.camel}');
		// Spaces
		expect(NameInterpolationPattern.execute('<<f   camel>>')).to.equal('${f.names.camel}');

		// Primary field
		expect(NameInterpolationPattern.execute('<<PrimaryField camel>>')).to.equal('${root.fields.primary.names.camel}');

		// Sub field
		expect(NameInterpolationPattern.execute('<<root.fields.primary camel>>')).to.equal('${root.fields.primary.names.camel}');
	});
});
