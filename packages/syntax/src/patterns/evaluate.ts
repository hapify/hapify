import { BasePattern } from './base';

/** Evaluation pattern */
const RegEx = /<<<([\s\S]+?)>>>/g;

/** Evaluate pattern */
export class EvaluatePattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(RegEx, (match, code) => this.dynamic(this.unescape(code)));
	}
}
