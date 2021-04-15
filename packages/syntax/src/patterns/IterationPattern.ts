import { ConditionalPattern } from './ConditionalPattern';

/** for() { pattern */
const ForPattern = /<<(@|for)(\d+)?\s+([a-zA-Z_.]+)(\s+[a-zA-Z()!+*\-/\s]+)?\s+([a-zA-Z_]+)\s*>>/g;
/** pattern */
const EndPattern = /<<(@|endfor)>>/g;

/** Conditional pattern */
export class IterationPattern extends ConditionalPattern {
	/** Parser method */
	execute(): void {
		this.replace(ForPattern, (match, statement, count, variable, condition, assignment) => {
			const jsFilter = this.filter(count, this.variable(variable), this.tester(condition));
			return this.dynamic(`for (const ${assignment} of ${jsFilter}) {`);
		}).replace(EndPattern, () => this.dynamic('}'));
	}

	/** Returns the array filter */
	private filter(count: string, variable: string, tester: string): string {
		const slicer = typeof count === 'undefined' ? '' : `.slice(0, ${count})`;

		return `${variable}.filter${tester}${slicer}`;
	}
}
