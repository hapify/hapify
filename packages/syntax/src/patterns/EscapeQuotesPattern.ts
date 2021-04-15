import { BasePattern } from './BasePattern';

/** Escape quotes pattern */
export class EscapeQuotesPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(/\$/g, '\\$').replace(/`/g, '\\`');
	}
}
