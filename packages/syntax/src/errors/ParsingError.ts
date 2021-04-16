import { NumberedError } from '../Interfaces';

export class ParsingError extends Error implements NumberedError {
  code = 1003;

  name = 'SyntaxParsingError';
}
