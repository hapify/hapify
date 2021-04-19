import { EvaluationError, Generator } from '@hapify/generator';
import { NumberedError } from '@hapify/generator/dist/interfaces';
import { Service } from 'typedi';

import { Channel } from '../class/Channel';
import { Model } from '../class/Model';
import { RichError } from '../class/RichError';
import { Template } from '../class/Template';
import { IGeneratorResult } from '../interface/Generator';

@Service()
export class GeneratorService {
  /** Compile for a whole channel */
  async runChannel(channel: Channel): Promise<IGeneratorResult[]> {
    const models = await channel.modelsCollection.list();
    return await Generator.run(channel.templates, models)
      .then((results) => this.filterEmptyFiles(results))
      .catch((e) => {
        throw this.formatGeneratorError(e);
      });
  }

  /**
   * Compile a template to multiple files.
   * One per model, if applicable.
   */
  async runTemplate(template: Template): Promise<IGeneratorResult[]> {
    const models = await template.channel().modelsCollection.list();
    return await Generator.run([template], models)
      .then((results) => this.filterEmptyFiles(results))
      .catch((e) => {
        throw this.formatGeneratorError(e);
      });
  }

  /**
   * Run generation process for one template/model
   * @throws {Error} If the template needs a model and no model is passed
   */
  async run(
    template: Template,
    model: Model | null,
  ): Promise<IGeneratorResult> {
    if (template.needsModel() && !model) {
      throw new Error('Model should be defined for this template');
    }
    const models = await template.channel().modelsCollection.list();
    const result = await Generator.run(
      [template],
      models,
      model ? [model.id] : null,
    ).catch((e) => {
      throw this.formatGeneratorError(e);
    });
    return result[0];
  }

  /** Compute path from a string */
  async pathPreview(path: string, model: Model | null = null): Promise<string> {
    try {
      return Generator.path(path, model ? model.name : null);
    } catch (e) {
      throw this.formatGeneratorError(e);
    }
  }

  /** Convert generator errors to internal RichError */
  private formatGeneratorError(error: NumberedError): RichError {
    const richError = new RichError(error.message, {
      code: error.code,
      type: error.name,
      columnNumber: (<EvaluationError>error).columnNumber,
      lineNumber: (<EvaluationError>error).lineNumber,
      details: (<EvaluationError>error).details,
    });
    if (error.stack) richError.stack = error.stack;
    return richError;
  }

  private filterEmptyFiles(results: IGeneratorResult[]): IGeneratorResult[] {
    return results.filter((result) => result.content.trim().length > 0);
  }
}
