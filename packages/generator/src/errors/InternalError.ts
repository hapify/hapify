import { NumberedError } from '../interfaces';

export class InternalError extends Error implements NumberedError {
  code = 2001;

  name = 'GeneratorInternalError';
}
