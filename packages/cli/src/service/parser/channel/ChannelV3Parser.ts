import { IStorableCompactConfig } from '../../../interface/Storage';
import { VersionedObjectParser } from '../../../interface/Version';

export class ChannelV3Parser
  implements VersionedObjectParser<IStorableCompactConfig> {
  convert(input: IStorableCompactConfig): IStorableCompactConfig {
    return input;
  }
}
