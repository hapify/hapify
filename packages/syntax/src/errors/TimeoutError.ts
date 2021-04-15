import { NumberedError } from '../interfaces';

export class TimeoutError extends Error implements NumberedError {
	name = 'SyntaxTimeoutError';

	code = 1005;
}
