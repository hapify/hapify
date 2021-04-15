import * as Fs from 'fs';
import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';
import { IterationPattern } from '../src/patterns/iteration';

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/templates/iteration-long.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/iteration.txt`, 'utf8');

const Condition = (test: string, length = 0, v = 'f', array = 'fields.list') =>
	(length
		? `\`;\nfor (const ${v} of root.${array}.filter((i) => ${test}).slice(0, ${length})) {\nout += \``
		: `\`;\nfor (const ${v} of root.${array}.filter((i) => ${test})) {\nout += \``
	).replace(/ /g, '');
const IterationPatternExecute = (template: string): string => IterationPattern.execute(template).replace(/ /g, '');

describe('iteration long', () => {
	it('run', async () => {
		//Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', async () => {
		//Start with not
		expect(IterationPatternExecute('<<for Fields -se*so f>>')).to.equal(Condition('!i.searchable && i.sortable'));
		expect(IterationPatternExecute('<<for Fields /se*so f>>')).to.equal(Condition('!i.searchable && i.sortable'));
		expect(IterationPatternExecute('<<for Fields !se*so f>>')).to.equal(Condition('!i.searchable && i.sortable'));

		// operator
		expect(IterationPatternExecute('<<for2 Fields !(se+so-lb)*pr/hd g>>')).to.equal(
			Condition('!(i.searchable || i.sortable || !i.label) && i.primary && !i.hidden', 2, 'g')
		);

		// properties
		expect(IterationPatternExecute('<<for Fields primary f>>')).to.equal(Condition('i.primary'));
		expect(IterationPatternExecute('<<for Fields unique f>>')).to.equal(Condition('i.unique'));
		expect(IterationPatternExecute('<<for Fields label f>>')).to.equal(Condition('i.label'));
		expect(IterationPatternExecute('<<for Fields nullable f>>')).to.equal(Condition('i.nullable'));
		expect(IterationPatternExecute('<<for Fields multiple f>>')).to.equal(Condition('i.multiple'));
		expect(IterationPatternExecute('<<for Fields searchable f>>')).to.equal(Condition('i.searchable'));
		expect(IterationPatternExecute('<<for Fields sortable f>>')).to.equal(Condition('i.sortable'));
		expect(IterationPatternExecute('<<for Fields hidden f>>')).to.equal(Condition('i.hidden'));
		expect(IterationPatternExecute('<<for Fields internal f>>')).to.equal(Condition('i.internal'));

		expect(IterationPatternExecute('<<for Fields string f>>')).to.equal(Condition("(i.type === 'string')"));
		expect(IterationPatternExecute('<<for Fields email f>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'email')"));
		expect(IterationPatternExecute('<<for Fields password f>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'password')"));
		expect(IterationPatternExecute('<<for Fields text f>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'text')"));

		expect(IterationPatternExecute('<<for Fields enum f>>')).to.equal(Condition("(i.type === 'enum')"));

		expect(IterationPatternExecute('<<for Fields number f>>')).to.equal(Condition("(i.type === 'number')"));
		expect(IterationPatternExecute('<<for Fields integer f>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'integer')"));
		expect(IterationPatternExecute('<<for Fields float f>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'float')"));
		expect(IterationPatternExecute('<<for Fields latitude f>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'latitude')"));
		expect(IterationPatternExecute('<<for Fields longitude f>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'longitude')"));

		expect(IterationPatternExecute('<<for Fields boolean f>>')).to.equal(Condition("(i.type === 'boolean')"));

		expect(IterationPatternExecute('<<for Fields datetime f>>')).to.equal(Condition("(i.type === 'datetime')"));
		expect(IterationPatternExecute('<<for Fields date f>>')).to.equal(Condition("(i.type === 'datetime' && i.subtype === 'date')"));
		expect(IterationPatternExecute('<<for Fields time f>>')).to.equal(Condition("(i.type === 'datetime' && i.subtype === 'time')"));

		expect(IterationPatternExecute('<<for Fields entity f>>')).to.equal(Condition("(i.type === 'entity')"));

		// relations
		expect(IterationPatternExecute('<<for Dependencies d>>')).to.equal(Condition('i', 0, 'd', 'dependencies'));
		expect(IterationPatternExecute('<<for ReferencedIn r>>')).to.equal(Condition('i', 0, 'r', 'referencedIn'));
		expect(IterationPatternExecute('<<for RefModels r>>')).to.equal(Condition('i', 0, 'r', 'referencedIn'));
		expect(IterationPatternExecute('<<for PrimaryField p>>')).to.equal(Condition('i', 0, 'p', 'fields.primary'));

		// spaces
		expect(IterationPatternExecute('<<for    Fields    primary    f  >>')).to.equal(Condition('i.primary'));

		// Closure
		expect(IterationPatternExecute('<<endfor>>')).to.equal('`;\n}\nout += `'.replace(/ /g, ''));

		// Sub fields
		expect(IterationPatternExecute('<<for m.f f>>')).to.equal('`;\nfor (const f of m.f.filter((i) => i)) {\nout += `'.replace(/ /g, ''));
	});
});
