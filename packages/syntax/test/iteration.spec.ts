import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { IterationPattern } from '../src/patterns/IterationPattern';

const Model = readJSONSync('./models/video.json');

const Input = readFileSync(`${__dirname}/templates/iteration.hpf`, 'utf8');
const Output = readFileSync(`${__dirname}/output/iteration.txt`, 'utf8');

describe('iteration', () => {
	it('run', () => {
		// Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', () => {
		const condition = (test: string, length = 0, v = 'f', array = 'fields.list') =>
			length
				? `\`;\nfor (const ${v} of root.${array}.filter((i) => ${test}).slice(0, ${length})) {\nout += \``
				: `\`;\nfor (const ${v} of root.${array}.filter((i) => ${test})) {\nout += \``;

		// Start with not
		expect(IterationPattern.execute('<<@ F -se*so f>>')).to.equal(condition('!i.searchable && i.sortable'));
		expect(IterationPattern.execute('<<@ F /se*so f>>')).to.equal(condition('!i.searchable && i.sortable'));
		expect(IterationPattern.execute('<<@ F !se*so f>>')).to.equal(condition('!i.searchable && i.sortable'));

		// operator
		expect(IterationPattern.execute('<<@2 F !(se+so-lb)*pr/hd g>>')).to.equal(
			condition('!(i.searchable || i.sortable || !i.label) && i.primary && !i.hidden', 2, 'g')
		);

		// properties
		expect(IterationPattern.execute('<<@ F pr f>>')).to.equal(condition('i.primary'));
		expect(IterationPattern.execute('<<@ F un f>>')).to.equal(condition('i.unique'));
		expect(IterationPattern.execute('<<@ F lb f>>')).to.equal(condition('i.label'));
		expect(IterationPattern.execute('<<@ F nu f>>')).to.equal(condition('i.nullable'));
		expect(IterationPattern.execute('<<@ F ml f>>')).to.equal(condition('i.multiple'));
		expect(IterationPattern.execute('<<@ F se f>>')).to.equal(condition('i.searchable'));
		expect(IterationPattern.execute('<<@ F so f>>')).to.equal(condition('i.sortable'));
		expect(IterationPattern.execute('<<@ F hd f>>')).to.equal(condition('i.hidden'));
		expect(IterationPattern.execute('<<@ F in f>>')).to.equal(condition('i.internal'));

		expect(IterationPattern.execute('<<@ F tS f>>')).to.equal(condition("(i.type === 'string')"));
		expect(IterationPattern.execute('<<@ F tSe f>>')).to.equal(condition("(i.type === 'string' && i.subtype === 'email')"));
		expect(IterationPattern.execute('<<@ F tSp f>>')).to.equal(condition("(i.type === 'string' && i.subtype === 'password')"));
		expect(IterationPattern.execute('<<@ F tSt f>>')).to.equal(condition("(i.type === 'string' && i.subtype === 'text')"));

		expect(IterationPattern.execute('<<@ F tU f>>')).to.equal(condition("(i.type === 'enum')"));

		expect(IterationPattern.execute('<<@ F tN f>>')).to.equal(condition("(i.type === 'number')"));
		expect(IterationPattern.execute('<<@ F tNi f>>')).to.equal(condition("(i.type === 'number' && i.subtype === 'integer')"));
		expect(IterationPattern.execute('<<@ F tNf f>>')).to.equal(condition("(i.type === 'number' && i.subtype === 'float')"));
		expect(IterationPattern.execute('<<@ F tNt f>>')).to.equal(condition("(i.type === 'number' && i.subtype === 'latitude')"));
		expect(IterationPattern.execute('<<@ F tNg f>>')).to.equal(condition("(i.type === 'number' && i.subtype === 'longitude')"));

		expect(IterationPattern.execute('<<@ F tB f>>')).to.equal(condition("(i.type === 'boolean')"));

		expect(IterationPattern.execute('<<@ F tD f>>')).to.equal(condition("(i.type === 'datetime')"));
		expect(IterationPattern.execute('<<@ F tDd f>>')).to.equal(condition("(i.type === 'datetime' && i.subtype === 'date')"));
		expect(IterationPattern.execute('<<@ F tDt f>>')).to.equal(condition("(i.type === 'datetime' && i.subtype === 'time')"));

		expect(IterationPattern.execute('<<@ F tE f>>')).to.equal(condition("(i.type === 'entity')"));

		// relations
		expect(IterationPattern.execute('<<@ D d>>')).to.equal(condition('i', 0, 'd', 'dependencies'));
		expect(IterationPattern.execute('<<@ R r>>')).to.equal(condition('i', 0, 'r', 'referencedIn'));
		expect(IterationPattern.execute('<<@ P p>>')).to.equal(condition('i', 0, 'p', 'fields.primary'));

		// spaces
		expect(IterationPattern.execute('<<@    F    pr    f  >>')).to.equal(condition('i.primary'));

		// Closure
		expect(IterationPattern.execute('<<@>>')).to.equal('`;\n}\nout += `');

		// Sub fields
		expect(IterationPattern.execute('<<@ m.f f>>')).to.equal('`;\nfor (const f of m.f.filter((i) => i)) {\nout += `');
	});

	it('fixes', () => {
		// Condition greater than 9
		expect(IterationPattern.execute('<<@14 F !se f>>')).to.not.equal('<<@14 F !se f>>');
	});
});
