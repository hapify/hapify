import Joi from 'joi';
import { Service } from 'typedi';

import { IChannel } from '../../interface/Objects';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { EmptyObject } from '../../interface/WebSocketHandlers';
import { ChannelsService } from '../Channels';

@Service()
export class GetChannelsHandlerService
  implements IWebSocketHandler<EmptyObject, IChannel[]> {
  constructor(private channelsService: ChannelsService) {}

  canHandle(message: WebSocketMessage<EmptyObject>): boolean {
    return message.id === 'get:channels';
  }

  validator(): Joi.Schema {
    return Joi.any();
  }

  async handle(): Promise<IChannel[]> {
    const channels = await this.channelsService.channels();
    return channels.map((channel) => channel.toObject());
  }
}
