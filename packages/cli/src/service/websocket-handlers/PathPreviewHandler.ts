import Joi from 'joi';
import { Service } from 'typedi';

import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketPathPreviewHandlerInput } from '../../interface/WebSocketHandlers';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';

@Service()
export class PathPreviewHandlerService
  implements IWebSocketHandler<WebSocketPathPreviewHandlerInput, string> {
  constructor(
    private channelsService: ChannelsService,
    private generatorService: GeneratorService,
  ) {}

  canHandle(
    message: WebSocketMessage<WebSocketPathPreviewHandlerInput>,
  ): boolean {
    return message.id === 'prv:path';
  }

  validator(): Joi.Schema {
    return Joi.object({
      model: Joi.string(),
      path: Joi.string().required(),
    });
  }

  async handle(
    message: WebSocketMessage<WebSocketPathPreviewHandlerInput>,
  ): Promise<string> {
    // Get model, if any
    const model = message.data.model
      ? (await this.channelsService.modelsCollection()).find(message.data.model)
      : null;
    // Compute the path
    return this.generatorService.pathPreview(message.data.path, model);
  }
}
