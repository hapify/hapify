import { Config } from '../../config';
import { GenerationContext } from '../../interfaces';
import { HapifyEJS } from '@hapify/ejs';
import { BaseGenerator } from './base-generator';

const HpfOptions = { timeout: Config.Generator.timeout };

export class EJSGenerator extends BaseGenerator {
	protected eval(content: string, context: GenerationContext): string {
		return new HapifyEJS(HpfOptions).run(content, context);
	}
}
