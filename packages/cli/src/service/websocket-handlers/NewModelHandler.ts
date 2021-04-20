import Joi from 'joi';
import { Service } from 'typedi';

import { Model } from '../../class/Model';
import { IModel } from '../../interface/Generator';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketNewModelHandlerInput } from '../../interface/WebSocketHandlers';
import { InfoService } from '../Info';

@Service()
export class NewModelHandlerService
  implements IWebSocketHandler<WebSocketNewModelHandlerInput, IModel> {
  constructor(private infoService: InfoService) {}

  canHandle(message: WebSocketMessage<WebSocketNewModelHandlerInput>): boolean {
    return message.id === 'new:model';
  }

  validator(): Joi.Schema {
    return Joi.object({
      name: Joi.string().required(),
    });
  }

  async handle(
    message: WebSocketMessage<WebSocketNewModelHandlerInput>,
  ): Promise<IModel> {
    return new Model({
      id: Model.generateTempId(),
      name: message.data.name,
      fields: await this.infoService.fields(),
      accesses: Model.defaultAccesses(),
    }).toObject();
  }
}
