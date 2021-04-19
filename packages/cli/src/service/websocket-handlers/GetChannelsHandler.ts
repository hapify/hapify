import Joi from 'joi';
import { Service } from 'typedi';

import { IChannel } from '../../interface/Objects';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { ChannelsService } from '../Channels';

@Service()
export class GetChannelsHandlerService
  implements IWebSocketHandler<{}, IChannel[]> {
  constructor(private channelsService: ChannelsService) {}

  canHandle(message: WebSocketMessage<{}>): boolean {
    return message.id === 'get:channels';
  }

  validator(): Joi.Schema {
    return Joi.any();
  }

  async handle(message: WebSocketMessage<{}>): Promise<IChannel[]> {
    const channels = await this.channelsService.channels();
    return await channels.map((channel) => channel.toObject());
  }
}
