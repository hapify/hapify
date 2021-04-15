import { BasePattern } from './base';

/** Comment pattern */
const RegEx = /<<#([\s\S]+?)>>/g;

/** Comment pattern */
export class CommentPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(RegEx, '');
	}
}
