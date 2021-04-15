import { BasePattern } from './BasePattern';

/** Interpolation pattern */
const RegEx = /<<=([\s\S]+?)>>/g;

/** Interpolation pattern */
export class InterpolationPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(RegEx, (match, code) => this.dynamic(`out += ${this.unescape(code)};`));
	}
}
