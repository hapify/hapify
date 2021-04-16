import { HapifyEJS } from '@hapify/ejs';

import { Config } from '../../Config';
import { GenerationContext } from '../../Interfaces';
import { BaseGenerator } from './BaseGenerator';

const HpfOptions = { timeout: Config.Generator.timeout };

export class EJSGenerator extends BaseGenerator {
  protected eval(content: string, context: GenerationContext): string {
    return new HapifyEJS(HpfOptions).run(content, context);
  }
}
