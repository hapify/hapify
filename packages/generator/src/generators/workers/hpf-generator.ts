import { HapifySyntax } from '@hapify/syntax';
import { Config } from '../../config';
import { GenerationContext } from '../../interfaces';
import { BaseGenerator } from './base-generator';

const HpfOptions = { timeout: Config.Generator.timeout };

export class HpfGenerator extends BaseGenerator {
	protected eval(content: string, context: GenerationContext): string {
		return HapifySyntax.run(content, context.m, HpfOptions);
	}
}
