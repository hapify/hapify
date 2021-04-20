import Joi from 'joi';
import { Service } from 'typedi';

import { Template } from '../../class/Template';
import { IGeneratorResult } from '../../interface/Generator';
import { TemplateSchema } from '../../interface/schema/Template';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketTemplatePreviewHandlerInput } from '../../interface/WebSocketHandlers';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';

@Service()
export class TemplatePreviewHandlerService
  implements
    IWebSocketHandler<WebSocketTemplatePreviewHandlerInput, IGeneratorResult> {
  constructor(
    private channelsService: ChannelsService,
    private generatorService: GeneratorService,
  ) {}

  canHandle(
    message: WebSocketMessage<WebSocketTemplatePreviewHandlerInput>,
  ): boolean {
    return message.id === 'prv:template';
  }

  validator(): Joi.Schema {
    return Joi.object({
      model: Joi.string(),
      channel: Joi.string().required(),
      template: TemplateSchema.required(),
    });
  }

  async handle(
    message: WebSocketMessage<WebSocketTemplatePreviewHandlerInput>,
  ): Promise<IGeneratorResult> {
    // Get channel
    const channel = (await this.channelsService.channels()).find(
      (c) => c.id === message.data.channel,
    );
    if (!channel) {
      throw new Error(`Unable to find channel ${message.data.channel}`);
    }
    // Get model, if any
    const model = message.data.model
      ? channel.modelsCollection.find(message.data.model)
      : null;
    // Get template
    const template = new Template(channel, message.data.template);
    // Compute the path
    return this.generatorService.run(template, model);
  }
}
