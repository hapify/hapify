import { NumberedError } from './interfaces';

export class InternalError extends Error implements NumberedError {
	code = 2001;
	name = 'GeneratorInternalError';
}
export class EvaluationError extends Error implements NumberedError {
	code = 2004;
	name = 'GeneratorEvaluationError';
	lineNumber: number = null;
	columnNumber: number = null;
	details: string = null;
}
export class TimeoutError extends Error implements NumberedError {
	code = 2005;
	name = 'GeneratorTimeoutError';
}
