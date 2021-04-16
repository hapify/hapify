import { NumberedError } from '../Interfaces';

export class TimeoutError extends Error implements NumberedError {
  code = 2005;

  name = 'GeneratorTimeoutError';
}
