import { NumberedError } from './interfaces';

export class InternalError extends Error implements NumberedError {
	code = 1001;

	name = 'SyntaxInternalError';
}
export class ArgumentsError extends Error implements NumberedError {
	code = 1002;

	name = 'SyntaxArgumentsError';
}
export class ParsingError extends Error implements NumberedError {
	code = 1003;

	name = 'SyntaxParsingError';
}
export class EvaluationError extends Error implements NumberedError {
	code = 1004;

	name = 'SyntaxEvaluationError';

	lineNumber: number = null;

	columnNumber: number = null;

	details: string = null;
}
export class TimeoutError extends Error implements NumberedError {
	name = 'SyntaxTimeoutError';

	code = 1005;
}
