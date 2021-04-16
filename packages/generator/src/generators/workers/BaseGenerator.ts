import { EvaluationError } from '../../errors/EvaluationError';
import {
  ExplicitModel,
  GenerationContext,
  GeneratorWorker,
  Template,
} from '../../Interfaces';

export abstract class BaseGenerator implements GeneratorWorker {
  one(model: ExplicitModel, template: Template): string {
    try {
      return this.eval(template.content, {
        model,
        m: model,
      });
    } catch (error) {
      throw this.appendFileName(error, template);
    }
  }

  all(models: ExplicitModel[], template: Template): string {
    try {
      return this.eval(template.content, {
        models,
        m: models,
      });
    } catch (error) {
      throw this.appendFileName(error, template);
    }
  }

  /** Append file name to error details if applicable */
  protected appendFileName(error: Error, template: Template): Error {
    if (this.errorIsEvaluationError(error)) {
      error.details += `\nFile: ${template.path}`;
    }
    return error;
  }

  private errorIsEvaluationError(error: Error): error is EvaluationError {
    return typeof (<EvaluationError>error).lineNumber !== 'undefined';
  }

  protected abstract eval(content: string, context: GenerationContext): string;
}
