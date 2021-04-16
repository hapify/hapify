import { readFileSync } from 'fs';
import { join } from 'path';

import { EvaluationError, HapifyVM } from '@hapify/vm';
import pkgDir from 'pkg-dir';

import { EjsEvaluationError } from './errors/EjsEvaluationError';

const SECOND = 1000;
const RootDir = pkgDir.sync(__dirname);
const EjsLibContent = readFileSync(join(RootDir, 'libs', 'ejs.js'), {
  encoding: 'utf8',
});

interface HapifyEJSOptions {
  timeout: number;
}

export { EjsEvaluationError };

export class HapifyEJS {
  /** Default options */
  private defaultOptions: HapifyEJSOptions = {
    timeout: SECOND,
  };

  /** Actual options */
  private options: HapifyEJSOptions;

  /** Constructor */
  constructor(options: Partial<HapifyEJSOptions> = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /** Wrap content in ejs compiler */
  private wrapWithEjs(content: string): string {
    const escapedContent = this.escapeContent(content);
    return `${EjsLibContent}
const content = \`${escapedContent}\`;
return ejs.compile(content)(context);
		`;
  }

  /** Escape string from ` and $ */
  private escapeContent(content: string): string {
    return content.replace(/\$/g, '\\$').replace(/`/g, '\\`');
  }

  /** Execute content */
  run(content: string, context: { [key: string]: any }): string | any {
    const wrappedContent = this.wrapWithEjs(content);
    const options = { ...this.options, eval: true };
    const vm = new HapifyVM(options);
    let result;

    try {
      result = vm.run(wrappedContent, { context });
    } catch (error) {
      throw this.transformEjsError(error);
    }

    return result;
  }

  private transformEjsError(
    error: Error | EvaluationError,
  ): EjsEvaluationError | Error {
    if (error instanceof EvaluationError) {
      if (error.details && error.details.startsWith('Error: ejs:')) {
        const lines = error.details.split('\n');

        const lastLine = lines
          .pop()
          .replace(/\. Line: [0-9]+, Column: [0-9]+/, '')
          .trim();

        const lineNumberMatches = /Error: ejs:([0-9]+)/.exec(lines[0]);
        const lineNumber = lineNumberMatches
          ? Number(lineNumberMatches[1])
          : null;

        const details = lines.join('\n').trim();

        const ejsError = new EjsEvaluationError(lastLine);
        ejsError.details = details;
        ejsError.lineNumber = lineNumber;

        return ejsError;
      }
    }
    return error;
  }
}
