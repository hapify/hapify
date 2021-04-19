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
  private _limits: ILimits;

  /** Stores the default fields */
  private _fields: IField[];

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
    if (!this._fields) {
      // Get defined fields
      const channels = await this.channelsService.channels();
      const channel = channels.find((c) => !!c.config.defaultFields);
      this._fields = channel ? channel.config.defaultFields : [];
    }
    return this._fields;
  }

  /** Get the limits once and returns them */
  async limits(): Promise<ILimits> {
    // Get the limits from API if the project is stored remotely otherwise returns local limits
    const channel = (await this.channelsService.channels())[0];
    if (!this._limits) {
      if (channel.project.storageType === 'remote') {
        this._limits = (
          await this.authenticatedApiService.get<ILimits>('generator/limits')
        ).data;
      } else {
        this._limits = { ...InternalConfig.limits};
      }
    }
    return this._limits;
  }
}
