import { IStorableCompactConfig } from '../../../interface/Storage';
import { VersionScope } from '../../../interface/Version';
import { Parser } from '../Parser';
import { ChannelV1Parser } from './ChannelV1Parser';
import { ChannelV2Parser } from './ChannelV2Parser';

export class ChannelParser extends Parser<IStorableCompactConfig> {
  protected getScope(): VersionScope {
    return 'channel';
  }

  protected getWorkersMap() {
    return {
      '1': ChannelV1Parser,
      '2': ChannelV2Parser,
    };
  }
}
