import { Service } from 'typedi';

import { InternalConfig } from '../config/Internal';
import { ILimits } from '../interface/Config';
import { IField } from '../interface/Generator';
import { IProject } from '../interface/Objects';
import { AuthenticatedApiService } from './AuthenticatedApi';
import { ChannelsService } from './Channels';

@Service()
export class InfoService {
  /** Stores the limits */
  private limitsValue: ILimits;

  /** Stores the default fields */
  private fieldsValue: IField[];

  constructor(
    private channelsService: ChannelsService,
    private authenticatedApiService: AuthenticatedApiService,
  ) {}

  /** Get the project once and returns it */
  async project(): Promise<IProject> {
    const channel = (await this.channelsService.channels())[0];
    return channel.project.toObject();
  }

  /** Get the default model field from channel */
  async fields(): Promise<IField[]> {
    if (!this.fieldsValue) {
      // Get defined fields
      const channels = await this.channelsService.channels();
      const channel = channels.find((c) => !!c.config.defaultFields);
      this.fieldsValue = channel ? channel.config.defaultFields : [];
    }
    return this.fieldsValue;
  }

  /** Get the limits once and returns them */
  async limits(): Promise<ILimits> {
    // Get the limits from API if the project is stored remotely otherwise returns local limits
    const channel = (await this.channelsService.channels())[0];
    if (!this.limitsValue) {
      if (channel.project.storageType === 'remote') {
        this.limitsValue = (
          await this.authenticatedApiService.get<ILimits>('generator/limits')
        ).data;
      } else {
        this.limitsValue = { ...InternalConfig.limits };
      }
    }
    return this.limitsValue;
  }
}
