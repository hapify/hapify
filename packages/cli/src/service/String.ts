import * as Case from 'case';
import { Service } from 'typedi';

import { IStringVariants } from '../interface/Generator';

@Service()
export class StringService {
  constructor() {}

  /** Returns the string with all formats */
  public variants(value: string): IStringVariants {
    return {
      raw: value,
      kebab: Case.kebab(value),
      snake: Case.snake(value),
      header: Case.header(value),
      constant: Case.constant(value),
      big: Case.constant(value).replace(/_/g, '-'),
      capital: Case.capital(value),
      lower: Case.lower(value),
      upper: Case.upper(value),
      compact: Case.snake(value).replace(/_/g, ''),
      pascal: Case.pascal(value),
      camel: Case.camel(value),
    };
  }

  /** Returns the variants names */
  public types(): (keyof IStringVariants)[] {
    return Object.keys(this.variants('')) as (keyof IStringVariants)[];
  }
}
