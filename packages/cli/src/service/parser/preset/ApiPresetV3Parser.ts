import { IApiPreset } from '../../../interface/Api';
import { VersionedObjectParser } from '../../../interface/Version';

export class ApiPresetV3Parser implements VersionedObjectParser<IApiPreset> {
  convert(input: IApiPreset): IApiPreset {
    return input;
  }
}
