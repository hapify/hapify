import { BasePattern } from './BasePattern';

/** Escape back-slashes pattern */
export class EscapeBackSlashesPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(/([\\]+)([^<>]|<<|$)/g, '$1$1$2');
	}
}
