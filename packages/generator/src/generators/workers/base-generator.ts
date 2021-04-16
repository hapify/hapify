import { ExplicitModel, GenerationContext, GeneratorWorker, Template } from '../../interfaces';
import { EvaluationError } from '../../errors';

export abstract class BaseGenerator implements GeneratorWorker {
	async one(model: ExplicitModel, template: Template): Promise<string> {
		try {
			return this.eval(template.content, {
				model: model,
				m: model,
			});
		} catch (error) {
			throw this.appendFileName(error, template);
		}
	}

	async all(models: ExplicitModel[], template: Template): Promise<string> {
		try {
			return this.eval(template.content, {
				models: models,
				m: models,
			});
		} catch (error) {
			throw this.appendFileName(error, template);
		}
	}

	/** Append file name to error details if applicable */
	protected appendFileName(error: Error, template: Template): Error {
		if (typeof (<EvaluationError>error).lineNumber !== 'undefined') {
			// Append file name
			(<EvaluationError>error).details += `\nFile: ${template.path}`;
		}
		return error;
	}

	protected abstract eval(content: string, context: GenerationContext): string;
}
