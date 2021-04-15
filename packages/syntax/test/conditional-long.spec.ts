import * as Fs from 'fs';
import { expect } from '@hapi/code';
import 'mocha';
import { HapifySyntax } from '../src';
import { ConditionalPattern } from '../src/patterns/conditional';

const Model = require('./models/video.json');
const Input = Fs.readFileSync(`${__dirname}/templates/conditional-long.hpf`, 'utf8');
const Output = Fs.readFileSync(`${__dirname}/output/conditional.txt`, 'utf8');

const Condition = (test: string, length = 0) =>
	`\`;\nif ((root.fields.list.filter && root.fields.list.filter((i) => ${test}).length > ${length}) || (!(root.fields.list.filter) && ((i) => ${test})(root.fields.list))) {\nout += \``.replace(
		/ /g,
		''
	);
const ConditionElse = (test: string, length = 0) =>
	`\`;\n} else if ((root.fields.list.filter && root.fields.list.filter((i) => ${test}).length > ${length}) || (!(root.fields.list.filter) && ((i) => ${test})(root.fields.list))) {\nout += \``.replace(
		/ /g,
		''
	);
const conditionModel = (test: string, length = 0) =>
	`\`;\nif ((root.filter && root.filter((i) => ${test}).length > ${length}) || (!(root.filter) && ((i) => ${test})(root))) {\nout += \``.replace(/ /g, '');
const ConditionAccesses = (test: string, length = 0) =>
	`\`;\nif ((root.accesses.list.filter && root.accesses.list.filter((i) => ${test}).length > ${length}) || (!(root.accesses.list.filter) && ((i) => ${test})(root.accesses.list))) {\nout += \``.replace(
		/ /g,
		''
	);
const ConditionAccessesActions = (test: string, action: string, length = 0) =>
	`\`;\nif ((root.accesses.${action}.filter && root.accesses.${action}.filter((i) => ${test}).length > ${length}) || (!(root.accesses.${action}.filter) && ((i) => ${test})(root.accesses.${action}))) {\nout += \``.replace(
		/ /g,
		''
	);
const ConditionalPatternExecute = (template: string): string => ConditionalPattern.execute(template).replace(/ /g, '');

describe('conditional long', () => {
	it('run', async () => {
		//Test input validity
		expect(Input).to.be.a.string();
		expect(Output).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(HapifySyntax.run(Input, Model)).to.equal(Output);
	});

	it('unit', async () => {
		//Start with not
		const notSe = Condition('!i.searchable', 3);
		expect(ConditionalPatternExecute('<<if4 Fields not se>>')).to.equal(notSe);
		expect(ConditionalPatternExecute('<<if4 Fields orNot se  >>')).to.equal(notSe);
		expect(ConditionalPatternExecute('<<if4 Fields andNot se>>')).to.equal(notSe);

		// operator
		expect(ConditionalPatternExecute('<<if Fields !(searchable+sortable-label)*primary/hidden>>')).to.equal(
			Condition('!(i.searchable || i.sortable || !i.label) && i.primary && !i.hidden')
		);

		// properties
		expect(ConditionalPatternExecute('<<if Fields primary>>')).to.equal(Condition('i.primary'));
		expect(ConditionalPatternExecute('<<if Fields unique>>')).to.equal(Condition('i.unique'));
		expect(ConditionalPatternExecute('<<if Fields label>>')).to.equal(Condition('i.label'));
		expect(ConditionalPatternExecute('<<if Fields nullable>>')).to.equal(Condition('i.nullable'));
		expect(ConditionalPatternExecute('<<if Fields multiple>>')).to.equal(Condition('i.multiple'));
		expect(ConditionalPatternExecute('<<if Fields embedded>>')).to.equal(Condition('i.embedded'));
		expect(ConditionalPatternExecute('<<if Fields searchable>>')).to.equal(Condition('i.searchable'));
		expect(ConditionalPatternExecute('<<if Fields sortable>>')).to.equal(Condition('i.sortable'));
		expect(ConditionalPatternExecute('<<if Fields hidden>>')).to.equal(Condition('i.hidden'));
		expect(ConditionalPatternExecute('<<if Fields internal>>')).to.equal(Condition('i.internal'));
		expect(ConditionalPatternExecute('<<if Fields restricted>>')).to.equal(Condition('i.restricted'));
		expect(ConditionalPatternExecute('<<if Fields ownership>>')).to.equal(Condition('i.ownership'));

		expect(ConditionalPatternExecute('<<if Fields string>>')).to.equal(Condition("(i.type === 'string')"));
		expect(ConditionalPatternExecute('<<if Fields email>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'email')"));
		expect(ConditionalPatternExecute('<<if Fields password>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'password')"));
		expect(ConditionalPatternExecute('<<if Fields url>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'url')"));
		expect(ConditionalPatternExecute('<<if Fields text>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'text')"));
		expect(ConditionalPatternExecute('<<if Fields richText>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'rich')"));
		expect(ConditionalPatternExecute('<<if Fields rich>>')).to.equal(Condition("(i.type === 'string' && i.subtype === 'rich')"));

		expect(ConditionalPatternExecute('<<if Fields enum>>')).to.equal(Condition("(i.type === 'enum')"));

		expect(ConditionalPatternExecute('<<if Fields number>>')).to.equal(Condition("(i.type === 'number')"));
		expect(ConditionalPatternExecute('<<if Fields integer>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'integer')"));
		expect(ConditionalPatternExecute('<<if Fields float>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'float')"));
		expect(ConditionalPatternExecute('<<if Fields latitude>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'latitude')"));
		expect(ConditionalPatternExecute('<<if Fields longitude>>')).to.equal(Condition("(i.type === 'number' && i.subtype === 'longitude')"));

		expect(ConditionalPatternExecute('<<if Fields boolean>>')).to.equal(Condition("(i.type === 'boolean')"));

		expect(ConditionalPatternExecute('<<if Fields datetime>>')).to.equal(Condition("(i.type === 'datetime')"));
		expect(ConditionalPatternExecute('<<if Fields date>>')).to.equal(Condition("(i.type === 'datetime' && i.subtype === 'date')"));
		expect(ConditionalPatternExecute('<<if Fields time>>')).to.equal(Condition("(i.type === 'datetime' && i.subtype === 'time')"));

		expect(ConditionalPatternExecute('<<if Fields entity>>')).to.equal(Condition("(i.type === 'entity')"));
		expect(ConditionalPatternExecute('<<if Fields oneOne>>')).to.equal(Condition("(i.type === 'entity' && i.subtype === 'oneOne')"));
		expect(ConditionalPatternExecute('<<if Fields oneMany>>')).to.equal(Condition("(i.type === 'entity' && i.subtype === 'oneMany')"));
		expect(ConditionalPatternExecute('<<if Fields manyOne>>')).to.equal(Condition("(i.type === 'entity' && i.subtype === 'manyOne')"));
		expect(ConditionalPatternExecute('<<if Fields manyMany>>')).to.equal(Condition("(i.type === 'entity' && i.subtype === 'manyMany')"));

		expect(ConditionalPatternExecute('<<if Fields object>>')).to.equal(Condition("(i.type === 'object')"));

		expect(ConditionalPatternExecute('<<if Fields file>>')).to.equal(Condition("(i.type === 'file')"));
		expect(ConditionalPatternExecute('<<if Fields image>>')).to.equal(Condition("(i.type === 'file' && i.subtype === 'image')"));
		expect(ConditionalPatternExecute('<<if Fields video>>')).to.equal(Condition("(i.type === 'file' && i.subtype === 'video')"));
		expect(ConditionalPatternExecute('<<if Fields audio>>')).to.equal(Condition("(i.type === 'file' && i.subtype === 'audio')"));
		expect(ConditionalPatternExecute('<<if Fields document>>')).to.equal(Condition("(i.type === 'file' && i.subtype === 'document')"));

		// properties
		expect(ConditionalPatternExecute('<<if Model mainlyHidden>>')).to.equal(conditionModel('i.properties.mainlyHidden'));
		expect(ConditionalPatternExecute('<<if Model mainlyInternal>>')).to.equal(conditionModel('i.properties.mainlyInternal'));
		expect(ConditionalPatternExecute('<<if Model isGeolocated>>')).to.equal(conditionModel('i.properties.isGeolocated'));
		expect(ConditionalPatternExecute('<<if Model isGeoSearchable>>')).to.equal(conditionModel('i.properties.isGeoSearchable'));

		// spaces
		expect(ConditionalPatternExecute('<<if   Fields   primary  >>')).to.equal(Condition('i.primary'));

		// Else if
		expect(ConditionalPatternExecute('<<elseif Fields primary>>')).to.equal(ConditionElse('i.primary'));
		expect(ConditionalPatternExecute('<<elseif6 Fields primary>>')).to.equal(ConditionElse('i.primary', 5));

		// Else
		expect(ConditionalPatternExecute('<<else>>')).to.equal('`;\n} else {\nout += `'.replace(/ /g, ''));

		// Closure
		expect(ConditionalPatternExecute('<<endif>>')).to.equal('`;\n}\nout += `'.replace(/ /g, ''));

		// Sub fields
		expect(ConditionalPatternExecute('<<if m.f>>')).to.equal(
			'`;\nif ((m.f.filter && m.f.filter((i) => i).length > 0) || (!(m.f.filter) && ((i) => i)(m.f))) {\nout += `'.replace(/ /g, '')
		);

		// Accesses
		expect(ConditionalPatternExecute('<<if Accesses ow>>')).to.equal(ConditionAccesses('i.owner'));

		// Accesses actions
		expect(ConditionalPatternExecute('<<if CreateAccess admin>>')).to.equal(ConditionAccessesActions('i.admin', 'create'));
		expect(ConditionalPatternExecute('<<if ReadAccess owner>>')).to.equal(ConditionAccessesActions('i.owner', 'read'));
		expect(ConditionalPatternExecute('<<if UpdateAccess auth>>')).to.equal(ConditionAccessesActions('i.auth', 'update'));
		expect(ConditionalPatternExecute('<<if RemoveAccess guest>>')).to.equal(ConditionAccessesActions('i.guest', 'remove'));

		expect(ConditionalPatternExecute('<<if CreateAccess gteAdmin>>')).to.equal(ConditionAccessesActions('i.gteAdmin', 'create'));
		expect(ConditionalPatternExecute('<<if ReadAccess gteOwner>>')).to.equal(ConditionAccessesActions('i.gteOwner', 'read'));
		expect(ConditionalPatternExecute('<<if UpdateAccess gteAuth>>')).to.equal(ConditionAccessesActions('i.gteAuth', 'update'));
		expect(ConditionalPatternExecute('<<if RemoveAccess gteGuest>>')).to.equal(ConditionAccessesActions('i.gteGuest', 'remove'));

		expect(ConditionalPatternExecute('<<if CreateAccess lteAdmin>>')).to.equal(ConditionAccessesActions('i.lteAdmin', 'create'));
		expect(ConditionalPatternExecute('<<if ReadAccess lteOwner>>')).to.equal(ConditionAccessesActions('i.lteOwner', 'read'));
		expect(ConditionalPatternExecute('<<if UpdateAccess lteAuth>>')).to.equal(ConditionAccessesActions('i.lteAuth', 'update'));
		expect(ConditionalPatternExecute('<<if RemoveAccess lteGuest>>')).to.equal(ConditionAccessesActions('i.lteGuest', 'remove'));

		expect(ConditionalPatternExecute('<<if SearchAccess owner>>')).to.equal(ConditionAccessesActions('i.owner', 'search'));
		expect(ConditionalPatternExecute('<<if CountAccess owner>>')).to.equal(ConditionAccessesActions('i.owner', 'count'));

		// Accesses properties
		expect(ConditionalPatternExecute('<<if Model onlyAdmin>>')).to.equal(conditionModel('i.accesses.properties.onlyAdmin'));
		expect(ConditionalPatternExecute('<<if Model onlyOwner>>')).to.equal(conditionModel('i.accesses.properties.onlyOwner'));
		expect(ConditionalPatternExecute('<<if Model onlyAuth>>')).to.equal(conditionModel('i.accesses.properties.onlyAuth'));
		expect(ConditionalPatternExecute('<<if Model onlyGuest>>')).to.equal(conditionModel('i.accesses.properties.onlyGuest'));
		expect(ConditionalPatternExecute('<<if Model maxAdmin>>')).to.equal(conditionModel('i.accesses.properties.maxAdmin'));
		expect(ConditionalPatternExecute('<<if Model maxOwner>>')).to.equal(conditionModel('i.accesses.properties.maxOwner'));
		expect(ConditionalPatternExecute('<<if Model maxAuth>>')).to.equal(conditionModel('i.accesses.properties.maxAuth'));
		expect(ConditionalPatternExecute('<<if Model maxGuest>>')).to.equal(conditionModel('i.accesses.properties.maxGuest'));
		expect(ConditionalPatternExecute('<<if Model noAdmin>>')).to.equal(conditionModel('i.accesses.properties.noAdmin'));
		expect(ConditionalPatternExecute('<<if Model noOwner>>')).to.equal(conditionModel('i.accesses.properties.noOwner'));
		expect(ConditionalPatternExecute('<<if Model noAuth>>')).to.equal(conditionModel('i.accesses.properties.noAuth'));
		expect(ConditionalPatternExecute('<<if Model noGuest>>')).to.equal(conditionModel('i.accesses.properties.noGuest'));
	}).slow(200);

	it('collisions', async () => {
		expect(ConditionalPatternExecute('<<if F in+integer >>')).to.equal(Condition(`i.internal || (i.type === 'number' && i.subtype === 'integer')`));
	});

	it('fix', async () => {
		expect(() => HapifySyntax.run('<<if R>>yes<<endif>>', Model)).to.not.throw();
	});
});
