import { VM } from 'vm2';

import { EvaluationError } from './errors/EvaluationError';
import { IntegrityError } from './errors/IntegrityError';
import { OutputError } from './errors/OutputError';
import { TimeoutError } from './errors/TimeoutError';

const SECOND = 1000;

interface HapifyVMOptions {
  timeout: number;
  allowAnyOutput: boolean;
  eval: boolean;
}

export class HapifyVM {
  /** Default options */
  private defaultOptions: HapifyVMOptions = {
    timeout: SECOND,
    allowAnyOutput: false,
    eval: false,
  };

  /** Actual options */
  private options: HapifyVMOptions;

  /** Built-in objects to remove from sandbox */
  private forbiddenObjects: {
    console: undefined;
  };

  /** RegEx used to extract error's line & column */
  private stackRegex = /vm\.js:([0-9]+):([0-9]+)/m;

  /** Constructor */
  constructor(options: Partial<HapifyVMOptions> = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /** Wrap content in auto-executable function */
  private wrap(content: string): string {
    return `(function() {\n${content}\n })()`;
  }

  /** Execute content */
  run(content: string, context: { [key: string]: any }): string | any {
    let result;

    const vm = new VM({
      timeout: this.options.timeout,
      sandbox: Object.assign(context, this.forbiddenObjects),
      compiler: 'javascript',
      eval: this.options.eval,
      wasm: false,
    });
    const wrappedContent = this.wrap(content);

    try {
      result = vm.run(wrappedContent);
    } catch (error) {
      // Check error
      if (
        typeof error.message !== 'string' ||
        typeof error.stack !== 'string'
      ) {
        throw new IntegrityError('Invalid error');
      }

      if (error.message.startsWith('Script execution timed out')) {
        throw new TimeoutError(error.message);
      }

      // Parse error
      const evalError = new EvaluationError(error.message);
      const matches = this.stackRegex.exec(error.stack);
      if (matches) {
        const lineNumber = Number(matches[1]) - 1; // Minus 1 for wrapper
        const columnNumber = Number(matches[2]);
        evalError.details = `Error: ${evalError.message}. Line: ${lineNumber}, Column: ${columnNumber}`;
        evalError.lineNumber = lineNumber;
        evalError.columnNumber = columnNumber;
      }

      throw evalError;
    }

    if (
      !this.options.allowAnyOutput &&
      typeof result !== 'undefined' &&
      typeof result !== 'string'
    ) {
      throw new OutputError('Must return a string');
    }

    return result;
  }
}
