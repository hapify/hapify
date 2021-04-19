import { IApiPreset } from '../../../interface/Api';
import { VersionedObjectParser } from '../../../interface/Version';

export class ApiPresetV2Parser implements VersionedObjectParser<IApiPreset> {
  convert(input: IApiPreset): IApiPreset {
    return input;
  }
}
