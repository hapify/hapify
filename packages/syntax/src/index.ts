import * as Hoek from '@hapi/hoek';
import { HapifyVM, EvaluationError as VMEvaluationError } from '@hapify/vm';
import LineColumn from 'line-column';

import { ArgumentsError } from './errors/ArgumentsError';
import { EvaluationError } from './errors/EvaluationError';
import { InternalError } from './errors/InternalError';
import { ParsingError } from './errors/ParsingError';
import { TimeoutError } from './errors/TimeoutError';
import { Action, ModelInput, Options, PatternFactory } from './Interfaces';
import { CommentPattern } from './patterns/CommentPattern';
import { ConditionalPattern } from './patterns/ConditionalPattern';
import { EscapeBackSlashesPattern } from './patterns/EscapeBackSlashesPattern';
import { EscapePattern } from './patterns/EscapePattern';
import { EscapeQuotesPattern } from './patterns/EscapeQuotesPattern';
import { EvaluatePattern } from './patterns/EvaluatePattern';
import { IndentPattern } from './patterns/IndentPattern';
import { InterpolationPattern } from './patterns/InterpolationPattern';
import { IterationPattern } from './patterns/IterationPattern';
import { MetaInterpolationPattern } from './patterns/MetaInterpolationPattern';
import { NameInterpolationPattern } from './patterns/NameInterpolationPattern';
import { NotesInterpolationPattern } from './patterns/NotesInterpolationPattern';

/** Ordered patterns */
const PatternsStack = [
  IndentPattern,
  EscapeBackSlashesPattern,
  EscapeQuotesPattern,
  CommentPattern,
  ConditionalPattern,
  IterationPattern,
  InterpolationPattern,
  NameInterpolationPattern,
  MetaInterpolationPattern,
  NotesInterpolationPattern,
  EvaluatePattern,
  EscapePattern,
];

const DefaultOptions: Options = {
  timeout: 1000,
};

export {
  ArgumentsError,
  EvaluationError,
  InternalError,
  ParsingError,
  TimeoutError,
};

/** @type {HapifySyntax} Syntax parser */
export class HapifySyntax implements PatternFactory {
  private options: Options;

  /** Stores the original input */
  private original: string;

  public actions: Action[] = [];

  private patterns = PatternsStack.map((Pattern) => new Pattern(this));

  /** Constructor */
  constructor(
    public template: string,
    private model: ModelInput,
    options: Partial<Options> = {},
  ) {
    this.original = template;
    this.options = <Options>Hoek.applyToDefaults(DefaultOptions, options);
  }

  /** Parser method */
  static run(
    template: string,
    model: ModelInput,
    options: Partial<Options> = {},
  ): string {
    // Check how many arguments
    if (arguments.length < 2) {
      throw new ArgumentsError(
        '[HapifySyntax.run] Requires at least two arguments',
      );
    }

    // Check arguments
    if (typeof template !== 'string') {
      throw new ArgumentsError('[HapifySyntax.run] template must be a string');
    }
    if (typeof model !== 'object') {
      throw new ArgumentsError('[HapifySyntax.run] model must be an object');
    }
    if (model === null) {
      throw new ArgumentsError('[HapifySyntax.run] model cannot be null');
    }

    const runner = new HapifySyntax(template, model, options);

    // Execute all patterns
    // @todo Should catch parsing error
    runner.parse();

    return runner.evaluate();
  }

  /** Execute all patterns to convert hpf to js */
  private parse(): void {
    for (const pattern of this.patterns) {
      pattern.execute();
    }
  }

  /** Eval the generated script */
  private evaluate(): string {
    // eslint-disable-line no-unused-vars
    // Cannot inject object with key root in context.
    const script = `const root = _root; let out = \n\`${this.template}\`\n; return out;`;
    try {
      const result = new HapifyVM({ timeout: this.options.timeout }).run(
        script,
        { _root: this.model },
      );
      return this.postProcess(result);
    } catch (error) {
      if (error.code === 6003) {
        throw new TimeoutError(
          `Template processing timed out (${this.options.timeout}ms)`,
        );
      }
      if (error.code === 6002) {
        throw this.getReversedActionError(error, -1);
      }
      throw error;
    }
  }

  /** Reverse all action to find the error line and column in the input file */
  private getReversedActionError(
    error: VMEvaluationError,
    lineOffset = 0,
  ): EvaluationError {
    // Get the line and column of the error
    const lineNumber =
      typeof error.lineNumber === 'number' ? error.lineNumber + lineOffset : 0;
    const columnNumber =
      typeof error.columnNumber === 'number' ? error.columnNumber : 0;
    let errorIndex = LineColumn(this.template).toIndex(
      lineNumber,
      columnNumber,
    );

    // Reverse all actions to find the line and column of the error in the input
    this.actions.reverse().forEach((action) => {
      if (errorIndex >= action.index) {
        // The error is impacted only if the error is in or after the action
        if (errorIndex <= action.index + action.after && action.after !== 0) {
          // If the error is in the action and the action is not a comment, the error is link to that action
          errorIndex = action.index;
        } else {
          // Else, move the errorIndex
          errorIndex += action.before - action.after;
        }
      }
    });

    const errorLineColumn = LineColumn(this.original).fromIndex(errorIndex);

    // Create the input error
    const evalError = new EvaluationError(error.message);
    evalError.lineNumber = errorLineColumn ? errorLineColumn.line : null;
    evalError.columnNumber = errorLineColumn ? errorLineColumn.col : null;
    evalError.details = `Error: ${evalError.message}. Line: ${evalError.lineNumber}, Column: ${evalError.columnNumber}`;

    return evalError;
  }

  /** Cleanup generated code */
  private postProcess(code: string): string {
    // Removes double empty lines
    const doubleLine = /\r?\n\r?\n/g;
    let output = code;
    while (output.match(doubleLine)) {
      output = output.replace(doubleLine, '\n');
    }

    const doubleLineWithSpace = /\r?\n *\r?\n/g;
    output = output.replace(doubleLineWithSpace, '\n\n');
    output = output.replace(doubleLineWithSpace, '\n\n');

    return output;
  }
}
