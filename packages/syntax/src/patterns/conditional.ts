import EscapeStringRegexp from 'escape-string-regexp';

import { InternalError } from '../errors/InternalError';
import { Replacement } from '../interfaces';
import { BasePattern } from './base';

/** if () { pattern */
const IfPattern = /<<(\?|if)(\d+)?\s+([a-zA-Z_.]+)(\s+[a-zA-Z()[\]!+*\-/\s]+)?\s*>>/g;
/** else if () { pattern */
const ElseIfPattern = /<<(\?\?|elseif)(\d+)?\s+([a-zA-Z_.]+)(\s+[a-zA-Z()[\]!+*\-/\s]+)?\s*>>/g;
/** else pattern */
const ElsePattern = /<<(\?\?|else)>>/g;
/** } pattern */
const EndPattern = /<<(\?|endif)>>/g;
/** Conditions short codes & operators */
const Replacements: Replacement[] = [
	// Operators
	{ search: ['andNot', '/'], replace: ' && !' },
	{ search: ['and', '*'], replace: ' && ' },
	{ search: ['orNot', '-'], replace: ' || !' },
	{ search: ['or', '+'], replace: ' || ' },
	{ search: ['not'], replace: ' ! ' },

	// Fields properties
	{ search: ['primary', 'pr'], replace: 'i.primary' },
	{ search: ['unique', 'un'], replace: 'i.unique' },
	{ search: ['label', 'lb'], replace: 'i.label' },
	{ search: ['nullable', 'nu'], replace: 'i.nullable' },
	{ search: ['multiple', 'ml'], replace: 'i.multiple' },
	{ search: ['embedded', 'em'], replace: 'i.embedded' },
	{ search: ['searchable', 'se'], replace: 'i.searchable' },
	{ search: ['sortable', 'so'], replace: 'i.sortable' },
	{ search: ['hidden', 'hd'], replace: 'i.hidden' },
	{ search: ['internal', 'in'], replace: 'i.internal' },
	{ search: ['restricted', 'rs'], replace: 'i.restricted' },
	{ search: ['ownership', 'os'], replace: 'i.ownership' },

	// Fields types for string
	{ search: ['email', 'tSe'], replace: "(i.type === 'string' && i.subtype === 'email')" },
	{
		search: ['password', 'tSp'],
		replace: "(i.type === 'string' && i.subtype === 'password')",
	},
	{ search: ['url', 'tSu'], replace: "(i.type === 'string' && i.subtype === 'url')" },
	{ search: ['text', 'tSt'], replace: "(i.type === 'string' && i.subtype === 'text')" },
	{ search: ['richText', 'rich', 'tSr'], replace: "(i.type === 'string' && i.subtype === 'rich')" },
	{ search: ['string', 'tS'], replace: "(i.type === 'string')" },

	// Fields types for enum
	{ search: ['enum', 'tU'], replace: "(i.type === 'enum')" },

	// Fields types for number
	{
		search: ['integer', 'tNi'],
		replace: "(i.type === 'number' && i.subtype === 'integer')",
	},
	{ search: ['float', 'tNf'], replace: "(i.type === 'number' && i.subtype === 'float')" },
	{
		search: ['latitude', 'tNt'],
		replace: "(i.type === 'number' && i.subtype === 'latitude')",
	},
	{
		search: ['longitude', 'tNg'],
		replace: "(i.type === 'number' && i.subtype === 'longitude')",
	},
	{ search: ['number', 'tN'], replace: "(i.type === 'number')" },

	// Fields types for boolean
	{ search: ['boolean', 'tB'], replace: "(i.type === 'boolean')" },

	// Fields types for datetime
	{ search: ['date', 'tDd'], replace: "(i.type === 'datetime' && i.subtype === 'date')" },
	{ search: ['time', 'tDt'], replace: "(i.type === 'datetime' && i.subtype === 'time')" },
	{ search: ['datetime', 'tD'], replace: "(i.type === 'datetime')" },

	// Fields types for entity
	{ search: ['entity', 'tE'], replace: "(i.type === 'entity')" },
	{ search: ['oneOne', 'tEoo'], replace: "(i.type === 'entity' && i.subtype === 'oneOne')" },
	{ search: ['oneMany', 'tEom'], replace: "(i.type === 'entity' && i.subtype === 'oneMany')" },
	{ search: ['manyOne', 'tEmo'], replace: "(i.type === 'entity' && i.subtype === 'manyOne')" },
	{ search: ['manyMany', 'tEmm'], replace: "(i.type === 'entity' && i.subtype === 'manyMany')" },

	// Fields types for object
	{ search: ['object', 'tO'], replace: "(i.type === 'object')" },

	// Fields types for file
	{ search: ['image', 'tFi'], replace: "(i.type === 'file' && i.subtype === 'image')" },
	{ search: ['video', 'tFv'], replace: "(i.type === 'file' && i.subtype === 'video')" },
	{ search: ['audio', 'tFa'], replace: "(i.type === 'file' && i.subtype === 'audio')" },
	{ search: ['document', 'tFd'], replace: "(i.type === 'file' && i.subtype === 'document')" },
	{ search: ['file', 'tF'], replace: "(i.type === 'file')" },

	// Models computed properties
	{ search: ['mainlyHidden', 'pMHd'], replace: 'i.properties.mainlyHidden' },
	{ search: ['mainlyInternal', 'pMIn'], replace: 'i.properties.mainlyInternal' },
	{ search: ['isGeolocated', 'pGeo'], replace: 'i.properties.isGeolocated' },
	{ search: ['isGeoSearchable', 'pGSe'], replace: 'i.properties.isGeoSearchable' },

	// Accesses actions properties
	{ search: ['gteAdmin', '[ad'], replace: 'i.gteAdmin' },
	{ search: ['gteOwner', '[ow'], replace: 'i.gteOwner' },
	{ search: ['gteAuth', '[au'], replace: 'i.gteAuth' },
	{ search: ['gteGuest', '[gs'], replace: 'i.gteGuest' },

	{ search: ['lteAdmin', 'ad]'], replace: 'i.lteAdmin' },
	{ search: ['lteOwner', 'ow]'], replace: 'i.lteOwner' },
	{ search: ['lteAuth', 'au]'], replace: 'i.lteAuth' },
	{ search: ['lteGuest', 'gs]'], replace: 'i.lteGuest' },

	{ search: ['admin', 'ad'], replace: 'i.admin' },
	{ search: ['owner', 'ow'], replace: 'i.owner' },
	{ search: ['auth', 'au'], replace: 'i.auth' },
	{ search: ['guest', 'gs'], replace: 'i.guest' },

	// Accesses computed properties
	{ search: ['onlyAdmin', 'pOAd'], replace: 'i.accesses.properties.onlyAdmin' },
	{ search: ['onlyOwner', 'pOOw'], replace: 'i.accesses.properties.onlyOwner' },
	{ search: ['onlyAuth', 'pOAu'], replace: 'i.accesses.properties.onlyAuth' },
	{ search: ['onlyGuest', 'pOGs'], replace: 'i.accesses.properties.onlyGuest' },
	{ search: ['maxAdmin', 'pMAd'], replace: 'i.accesses.properties.maxAdmin' },
	{ search: ['maxOwner', 'pMOw'], replace: 'i.accesses.properties.maxOwner' },
	{ search: ['maxAuth', 'pMAu'], replace: 'i.accesses.properties.maxAuth' },
	{ search: ['maxGuest', 'pMGs'], replace: 'i.accesses.properties.maxGuest' },
	{ search: ['noAdmin', 'pNAd'], replace: 'i.accesses.properties.noAdmin' },
	{ search: ['noOwner', 'pNOw'], replace: 'i.accesses.properties.noOwner' },
	{ search: ['noAuth', 'pNAu'], replace: 'i.accesses.properties.noAuth' },
	{ search: ['noGuest', 'pNGs'], replace: 'i.accesses.properties.noGuest' },
];
/** Denotes if a string contains non alphanumeric char */
const HasNonAlphaNumeric = (s: string): boolean => !/^[a-zA-Z0-9]+$/.test(s);
/** Convert replacement search for regexp */
const ForRegExp = (r: Replacement): string =>
	r.search
		.map(EscapeStringRegexp)
		.map((s) => (HasNonAlphaNumeric(s) ? s : `\\b${s}\\b`))
		.join('|');
/** Dynamic regex for replacements */
const Condition = new RegExp(`(${Replacements.map(ForRegExp).join('|')})`, 'g');
/** Testers caching */
const Testers: { [key: string]: string } = {};

/** Conditional pattern */
export class ConditionalPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(IfPattern, (match, statement, count, variable, condition) => {
			const jsCondition = this.condition(count, this.variable(variable), this.tester(condition));
			return this.dynamic(`if (${jsCondition}) {`);
		})
			.replace(ElseIfPattern, (match, statement, count, variable, condition) => {
				const jsCondition = this.condition(count, this.variable(variable), this.tester(condition));
				return this.dynamic(`} else if (${jsCondition}) {`);
			})
			.replace(ElsePattern, () => this.dynamic('} else {'))
			.replace(EndPattern, () => this.dynamic('}'));
	}

	/** Returns the full condition to be injected in the 'if' statement */
	private condition(count: string, variable: string, tester: string): string {
		const threshold = typeof count === 'undefined' ? 0 : Number(count) - 1;
		const arrayTest = `(${variable}.filter && ${variable}.filter${tester}.length > ${threshold})`;
		const objectTest = `(!(${variable}.filter) && ${tester}(${variable}))`;

		return `${arrayTest} || ${objectTest}`;
	}

	/** Convert the condition short code to tester method */
	protected tester(conditionBody: string): string {
		const noCondition = '((i) => i)';

		// Quick exit
		if (typeof conditionBody === 'undefined') {
			return noCondition;
		}

		const trimmed = conditionBody.trim();

		if (trimmed.length === 0) {
			return noCondition;
		}

		if (typeof Testers[trimmed] === 'undefined') {
			const condition = trimmed
				.replace(Condition, (match) => {
					const replacement = Replacements.find((l) => l.search.includes(match));
					if (!replacement) {
						throw new InternalError(`[ConditionalPattern.tester] Cannot find condition replacement for match: ${match} (in :${trimmed})`);
					}

					return replacement.replace;
				})
				.trim()
				.replace(/^&&/g, '')
				.replace(/^\|\|/g, '')
				.trim();

			Testers[trimmed] = `((i) => ${condition})`;
		}

		return Testers[trimmed];
	}

	/** Convert the input variable to the real variable */
	protected variable(variable: string): string {
		if (['M', 'Models', 'Model'].includes(variable)) return 'root';
		if (['F', 'Fields'].includes(variable)) return 'root.fields.list';
		if (['D', 'Dependencies'].includes(variable)) return 'root.dependencies';
		if (['R', 'ReferencedIn', 'RefModels'].includes(variable)) return 'root.referencedIn';
		if (['P', 'PrimaryField'].includes(variable)) return 'root.fields.primary';
		// Accesses
		if (['A', 'Accesses'].includes(variable)) return 'root.accesses.list';
		if (['Ac', 'CreateAccess'].includes(variable)) return 'root.accesses.create';
		if (['Ar', 'ReadAccess'].includes(variable)) return 'root.accesses.read';
		if (['Au', 'UpdateAccess'].includes(variable)) return 'root.accesses.update';
		if (['Ad', 'RemoveAccess'].includes(variable)) return 'root.accesses.remove';
		if (['As', 'SearchAccess'].includes(variable)) return 'root.accesses.search';
		if (['An', 'CountAccess'].includes(variable)) return 'root.accesses.count';

		return variable;
	}
}

// For dev only: Code block to output reserved words
// console.log(
// 	"`" + Replacements
// 		.map(r => r.search)
// 		.reduce((a, c) => a.concat(c), [])
// 		.filter(s => !HasNonAlphaNumeric(s))
// 		.concat([
// 			'out', 'root',
// 			'if', 'elseif', 'else', 'endif',
// 			'for', 'endfor',
// 			'M', 'Models', 'Model',
// 			'F', 'Fields',
// 			'D', 'Dependencies',
// 			'R', 'ReferencedIn', 'RefModels',
// 			'P', 'PrimaryField',
// 			'A', 'Accesses',
// 			'Ac', 'CreateAccess',
// 			'Ar', 'ReadAccess',
// 			'Au', 'UpdateAccess',
// 			'Ad', 'RemoveAccess',
// 			'As', 'SearchAccess',
// 			'An', 'CountAccess'
// 		])
// 		.sort((a, b) => a.localeCompare(b))
// 		.join("`, `") + "`"
// );
