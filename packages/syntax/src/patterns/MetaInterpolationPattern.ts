import EscapeStringRegexp from 'escape-string-regexp';

import { ParsingError } from '../errors/ParsingError';
import { Replacement } from '../Interfaces';
import { BasePattern } from './BasePattern';
import { CasesReplacements } from './NameInterpolationPattern';

/** Convert case words for regexp */
const ForRegExp = (r: Replacement): string =>
  r.search.map(EscapeStringRegexp).join('|');
/** Meta interpolation pattern */
const RegEx = new RegExp(
  `<<-\\s*([a-zA-Z_.]+)\\s+([a-zA-Z0-9_]+)\\s+(${CasesReplacements.map(
    ForRegExp,
  ).join('|')})\\s*>>`,
  'g',
);

/** MetaInterpolation pattern */
export class MetaInterpolationPattern extends BasePattern {
  /** Parser method */
  execute(): void {
    this.replace(RegEx, (match, variable, meta, property) => {
      // Get the var
      let jsVariable = variable;
      if (['M', 'Model'].includes(jsVariable)) jsVariable = 'root';
      else if (['P', 'PrimaryField'].includes(jsVariable))
        jsVariable = 'root.fields.primary';

      // Get the property
      const matchingCase = CasesReplacements.find((c) =>
        c.search.includes(property),
      );
      if (!matchingCase) {
        throw new ParsingError(
          `[MetaInterpolationPattern.execute] Unknown name property: ${property}`,
        );
      }
      const jsProperty = matchingCase.replace;

      return `\${${jsVariable}.meta.${meta}.${jsProperty}}`;
    });
  }
}
