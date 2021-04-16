import { VersionedObjectParser } from '../../../interface/Version';
import { IStorableCompactConfig } from '../../../interface/Storage';

export class ChannelV2Parser implements VersionedObjectParser<IStorableCompactConfig> {
	convert(input: IStorableCompactConfig): IStorableCompactConfig {
		return input;
	}
}
