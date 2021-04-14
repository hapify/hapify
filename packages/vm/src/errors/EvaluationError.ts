export class EvaluationError extends Error {
  code = 6002;

  name = 'VmEvaluationError';

  lineNumber: number = null;

  columnNumber: number = null;

  details: string = null;
}
