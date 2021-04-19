import Joi from 'joi';
import { Service } from 'typedi';

import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGetInfoHandlerOutput } from '../../interface/WebSocketHandlers';
import { InfoService } from '../Info';

@Service()
export class GetInfoHandlerService
  implements IWebSocketHandler<{}, WebSocketGetInfoHandlerOutput> {
  constructor(private infoService: InfoService) {}

  canHandle(message: WebSocketMessage<{}>): boolean {
    return message.id === 'get:info';
  }

  validator(): Joi.Schema {
    return Joi.any();
  }

  async handle(
    message: WebSocketMessage<{}>,
  ): Promise<WebSocketGetInfoHandlerOutput> {
    return {
      project: await this.infoService.project(),
      limits: await this.infoService.limits(),
    };
  }
}
