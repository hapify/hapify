import { decode } from 'html-entities';
import { renderToStaticMarkup } from 'react-dom/server';

import { EvaluationError } from '../../errors/EvaluationError';
import {
  ExplicitModel,
  GenerationContext,
  GeneratorWorker,
  Template,
} from '../../Interfaces';

export class JsxGenerator implements GeneratorWorker {
  async one(model: ExplicitModel, template: Template): Promise<string> {
    try {
      return this.eval(template.path, { model, m: model });
    } catch (error) {
      throw this.appendFileName(error, template);
    }
  }

  async all(models: ExplicitModel[], template: Template): Promise<string> {
    try {
      return this.eval(template.path, { models, m: models });
    } catch (error) {
      throw this.appendFileName(error, template);
    }
  }

  /**
   * Method that will require the function from the path and exec the react to string
   */
  protected async eval(
    path: string,
    context: GenerationContext,
  ): Promise<string> {
    const templateJsx = await import(path);

    if (!(typeof templateJsx.default === 'function'))
      throw new Error(`The JSX file ${path} export default must be a function`);

    return decode(renderToStaticMarkup(templateJsx.default({ context })));
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
}
