import { NumberedError } from '../Interfaces';

export class ArgumentsError extends Error implements NumberedError {
	code = 1002;

	name = 'SyntaxArgumentsError';
}
