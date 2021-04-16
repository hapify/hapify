import { NumberedError } from '../Interfaces';

export class TimeoutError extends Error implements NumberedError {
  name = 'SyntaxTimeoutError';

  code = 1005;
}
