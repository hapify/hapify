import { BasePattern } from './BasePattern';

/** Notes interpolation pattern */
const RegEx = new RegExp(`<<!\\s*([a-zA-Z_.]+)\\s*>>`, 'g');

/** NotesInterpolation pattern */
export class NotesInterpolationPattern extends BasePattern {
  /** Parser method */
  execute(): void {
    this.replace(RegEx, (match, variable) => {
      // Get the var
      let jsVariable = variable;
      if (['M', 'Model'].includes(jsVariable)) jsVariable = 'root';
      else if (['P', 'PrimaryField'].includes(jsVariable))
        jsVariable = 'root.fields.primary';

      return `\${${jsVariable}.notes}`;
    });
  }
}
