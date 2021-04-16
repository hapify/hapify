export class EjsEvaluationError extends Error {
  code = 7001;

  name = 'EjsEvaluationError';

  lineNumber: number = null;

  details: string = null;
}
