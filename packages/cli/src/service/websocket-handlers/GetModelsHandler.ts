import Joi from 'joi';
import { Service } from 'typedi';

import { IModel } from '../../interface/Generator';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { EmptyObject } from '../../interface/WebSocketHandlers';
import { ChannelsService } from '../Channels';

@Service()
export class GetModelsHandlerService
  implements IWebSocketHandler<EmptyObject, IModel[]> {
  constructor(private channelsService: ChannelsService) {}

  canHandle(message: WebSocketMessage<EmptyObject>): boolean {
    return message.id === 'get:models';
  }

  validator(): Joi.Schema {
    return Joi.any();
  }

  async handle(): Promise<IModel[]> {
    return (await this.channelsService.modelsCollection()).toObject();
  }
}
