import { VersionedObjectParser } from '../../../interface/Version';
import { IApiPreset } from '../../../interface/Api';

export class ApiPresetV2Parser implements VersionedObjectParser<IApiPreset> {
	convert(input: IApiPreset): IApiPreset {
		return input;
	}
}
