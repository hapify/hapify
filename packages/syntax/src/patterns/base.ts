import LineColumn from 'line-column';

import { Action, PatternFactory, ReplacementCallback } from '../interfaces';

/** Abstract base pattern */
export class BasePattern {
	constructor(private factory: PatternFactory) {}

	/** Parser method */
	execute(): void {
		/* Do Nothing */
	}

	/** Escape string and insert js code */
	protected dynamic(js: string): string {
		return `\`;
${js}
out += \``;
	}

	/** Reverse escape signs ` $ \ escaped by EscapeQuotesPattern & EscapeBackSlashesPattern */
	protected unescape(code: string): string {
		return code.replace(/\\\\/g, '\\').replace(/\\`/g, '`').replace(/\\\$/g, '$');
	}

	/** Perform a regex replacement and saves the actions made on the string */
	protected replace(regexp: RegExp | string, replace: string | ReplacementCallback): this {
		let patternOffset = 0;

		this.factory.template = this.factory.template.replace(regexp, (...params: string[]) => {
			const match = params[0];
			const offset = Number(params[params.length - 2]);

			const replaceString = typeof replace === 'function' ? replace(...params) : match.replace(regexp, replace);

			// Save the impact of this replacement
			this.factory.actions.push({
				index: patternOffset + offset,
				lineColumn: LineColumn(this.factory.template).fromIndex(patternOffset + offset),
				before: match.length,
				after: replaceString.length,
			});

			patternOffset += replaceString.length - match.length;

			return replaceString;
		});

		return this;
	}

	/** Static parser method used for testing purpose */
	static execute(template: string): string {
		// Create a fake parent
		const parent = { template, actions: [] as Action[] };
		// Init an instance
		const pattern = new this(parent);
		// Execute the pattern and return the modified template
		pattern.execute();

		return parent.template;
	}
}
