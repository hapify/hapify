import { IApiPreset } from '../../../interface/Api';
import { VersionScope } from '../../../interface/Version';
import { Parser } from '../Parser';
import { ApiPresetV1Parser } from './ApiPresetV1Parser';
import { ApiPresetV2Parser } from './ApiPresetV2Parser';
import { ApiPresetV3Parser } from './ApiPresetV3Parser';

export class ApiPresetParser extends Parser<IApiPreset> {
  protected getScope(): VersionScope {
    return 'preset';
  }

  protected getWorkersMap() {
    return {
      '1': ApiPresetV1Parser,
      '2': ApiPresetV2Parser,
      '3': ApiPresetV3Parser,
    };
  }
}
