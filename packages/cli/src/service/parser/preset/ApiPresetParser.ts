import { VersionScope } from '../../../interface/Version';
import { ApiPresetV1Parser } from './ApiPresetV1Parser';
import { Parser } from '../Parser';
import { IApiPreset } from '../../../interface/Api';
import { ApiPresetV2Parser } from './ApiPresetV2Parser';

export class ApiPresetParser extends Parser<IApiPreset> {
	protected getScope(): VersionScope {
		return 'preset';
	}
	protected getWorkersMap() {
		return {
			'1': ApiPresetV1Parser,
			'2': ApiPresetV2Parser,
		};
	}
}
