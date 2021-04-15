import EscapeStringRegexp from 'escape-string-regexp';

import { ParsingError } from '../errors/ParsingError';
import { Replacement } from '../interfaces';
import { BasePattern } from './base';

const Cases: Replacement[] = [
	{ search: ['aA', 'camel'], replace: 'camel' },
	{ search: ['AA', 'pascal'], replace: 'pascal' },
	{ search: ['a', 'lower'], replace: 'lower' },
	{ search: ['A', 'capital'], replace: 'capital' },
	{ search: ['a-a', 'kebab'], replace: 'kebab' },
	{ search: ['A-A', 'header'], replace: 'header' },
	{ search: ['a_a', 'snake'], replace: 'snake' },
	{ search: ['A_A', 'constant'], replace: 'constant' },
	{ search: ['aa', 'compact'], replace: 'compact' },
	{ search: ['R', 'raw'], replace: 'raw' },
];

/** Convert case words for regexp */
const ForRegExp = (r: Replacement): string => r.search.map(EscapeStringRegexp).join('|');
/** Name interpolation pattern */
const RegEx = new RegExp(`<<([a-zA-Z_.]+)\\s+(${Cases.map(ForRegExp).join('|')})\\s*>>`, 'g');

/** NameInterpolation pattern */
export class NameInterpolationPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(RegEx, (match, variable, property) => {
			// Get the var
			let jsVariable = variable;
			if (['M', 'Model'].includes(jsVariable)) jsVariable = 'root';
			else if (['P', 'PrimaryField'].includes(jsVariable)) jsVariable = 'root.fields.primary';

			// Get the property
			const matchingCase = Cases.find((c) => c.search.includes(property));
			if (!matchingCase) {
				throw new ParsingError(`[NameInterpolationPattern.execute] Unknown name property: ${property}`);
			}
			const jsProperty = matchingCase.replace;

			return `\${${jsVariable}.names.${jsProperty}}`;
		});
	}
}
