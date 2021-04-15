import { BasePattern } from './base';

/** Start pattern and replacer */
const Start = {
	find: /\\<\\</g,
	replace: '<<',
};
/** end pattern and replacer */
const End = {
	find: /\\>\\>/g,
	replace: '>>',
};

/** Escape pattern */
export class EscapePattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(Start.find, Start.replace).replace(End.find, End.replace);
	}
}
