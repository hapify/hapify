import { IApiModel } from '../../../interface/Api';
import { VersionScope } from '../../../interface/Version';
import { Parser } from '../Parser';
import { ApiModelV1Parser } from './ApiModelV1Parser';
import { ApiModelV2Parser } from './ApiModelV2Parser';
import { ApiModelV3Parser } from './ApiModelV3Parser';

export class ApiModelParser extends Parser<IApiModel> {
  protected getScope(): VersionScope {
    return 'model';
  }

  protected getWorkersMap() {
    return {
      '1': ApiModelV1Parser,
      '2': ApiModelV2Parser,
      '3': ApiModelV3Parser,
    };
  }
}
