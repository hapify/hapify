import { NumberedError } from '../interfaces';

export class ArgumentsError extends Error implements NumberedError {
	code = 1002;

	name = 'SyntaxArgumentsError';
}
