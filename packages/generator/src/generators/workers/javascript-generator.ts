import { HapifyVM, EvaluationError as VmEvaluationError } from '@hapify/vm';

import { Config } from '../../config';
import { EvaluationError } from '../../errors/EvaluationError';
import { TimeoutError } from '../../errors/TimeoutError';
import { GenerationContext } from '../../interfaces';
import { BaseGenerator } from './base-generator';

export class JavascriptGenerator extends BaseGenerator {
  protected eval(content: string, context: GenerationContext): string {
    try {
      return new HapifyVM({ timeout: Config.Generator.timeout }).run(
        content,
        context,
      );
    } catch (error) {
      if (error.code === 6003) {
        throw new TimeoutError(
          `Template processing timed out (${Config.Generator.timeout}ms)`,
        );
      }
      if (error.code === 6002) {
        // Clone error
        const evalError = new EvaluationError(error.message);
        evalError.details = `Error: ${evalError.message}. Line: ${
          (error as VmEvaluationError).lineNumber
        }, Column: ${(error as VmEvaluationError).columnNumber}`;
        evalError.lineNumber = error.lineNumber;
        evalError.columnNumber = error.columnNumber;
        throw evalError;
      }
      throw error;
    }
  }
}
