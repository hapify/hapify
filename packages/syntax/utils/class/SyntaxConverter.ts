export type ConverterReplacement = { search: string | RegExp; replace: string; bypass?: (inner: string) => boolean };

export abstract class SyntaxConverter {
	protected extractor = /<<([a-zA-Z@/?][^>]*?)>>/gm;
	protected abstract replacers: ConverterReplacement[];

	constructor(private template: string) {}

	execute(): string {
		// Extract parts to convert (conditions, iterations and name interpolations)
		return this.template.replace(this.extractor, (part: string, inner: string) => {
			let output = inner;
			for (const replacer of this.replacers) {
				if (typeof replacer.bypass === 'function' && replacer.bypass(inner)) {
					continue;
				}
				output = output.replace(replacer.search, replacer.replace);
			}
			return `<<${this.cleanUp(output)}>>`;
		});
	}

	protected cleanUp(inner: string): string {
		// Remove double spaces
		return inner.replace(/\s\s+/g, ' ');
	}
}
