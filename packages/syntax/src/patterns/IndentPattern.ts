import { BasePattern } from './BasePattern';

const IndentToRemove = /^ +<<(#|<|\?\?|\?|@|if|for|else|elseif|endif|endfor)([\s\S]*?)>>/gm;
const IndentReplace = '<<$1$2>>';

/** Escape pattern */
export class IndentPattern extends BasePattern {
	/** Parser method */
	execute(): void {
		this.replace(IndentToRemove, IndentReplace);
	}
}
