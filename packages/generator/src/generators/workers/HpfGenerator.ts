import { HapifySyntax } from '@hapify/syntax';

import { Config } from '../../Config';
import { GenerationContext } from '../../Interfaces';
import { BaseGenerator } from './BaseGenerator';

const HpfOptions = { timeout: Config.Generator.timeout };

export class HpfGenerator extends BaseGenerator {
  protected eval(content: string, context: GenerationContext): string {
    return HapifySyntax.run(content, context.m, HpfOptions);
  }
}
