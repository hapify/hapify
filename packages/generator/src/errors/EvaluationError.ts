import { NumberedError } from '../interfaces';

export class EvaluationError extends Error implements NumberedError {
  code = 2004;

  name = 'GeneratorEvaluationError';

  lineNumber: number = null;

  columnNumber: number = null;

  details: string = null;
}
