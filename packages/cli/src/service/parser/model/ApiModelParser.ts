import { VersionScope } from '../../../interface/Version';
import { ApiModelV1Parser } from './ApiModelV1Parser';
import { ApiModelV2Parser } from './ApiModelV2Parser';
import { Parser } from '../Parser';
import { IApiModel } from '../../../interface/Api';

export class ApiModelParser extends Parser<IApiModel> {
	protected getScope(): VersionScope {
		return 'model';
	}
	protected getWorkersMap() {
		return {
			'1': ApiModelV1Parser,
			'2': ApiModelV2Parser,
		};
	}
}
