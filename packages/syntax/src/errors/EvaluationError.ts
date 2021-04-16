import { NumberedError } from '../Interfaces';

export class EvaluationError extends Error implements NumberedError {
  code = 1004;

  name = 'SyntaxEvaluationError';

  lineNumber: number = null;

  columnNumber: number = null;

  details: string = null;
}
