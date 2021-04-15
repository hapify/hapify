import { NumberedError } from '../interfaces';

export class InternalError extends Error implements NumberedError {
	code = 1001;

	name = 'SyntaxInternalError';
}
