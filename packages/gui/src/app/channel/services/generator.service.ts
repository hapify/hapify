import { Injectable } from '@angular/core';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { WebSocketService } from '@app/services/websocket.service';

import { IModel } from '../../model/model.module';
import { IChannel } from '../interfaces/channel';
import { IGeneratorResult } from '../interfaces/generator-result';
import { ITemplate } from '../interfaces/template';


@Injectable()
export class GeneratorService {
  /** Used to keep activation across multiple editors */
  public autoSyncEnabled = false;

  /** Constructor */
  constructor(private webSocketService: WebSocketService) {}

  /**
   * Compile a template to multiple files.
   * One per model, if applicable.
   */
  async compileTempate(template: ITemplate): Promise<void> {
    await this.webSocketService.send(WebSocketMessages.GENERATE_TEMPLATE, {
      channel: template.channel().id,
      template: template.path,
    });
  }

  /** Compile a whole channel to multiple files. */
  async compileChannel(channel: IChannel): Promise<void> {
    await this.webSocketService.send(WebSocketMessages.GENERATE_CHANNEL, {
      channel: channel.id,
    });
  }

  /**
   * Run generation process
   * @throws If the template needs a model and no model is passed
   */
  async run(
    template: ITemplate,
    model: IModel | null,
  ): Promise<IGeneratorResult> {
    const data: any = {
      template: template.toObject(),
      channel: template.channel().id,
    };
    if (template.needsModel()) {
      if (!model) {
        throw new Error('Model should be defined for this template');
      }
      data.model = model.id;
    }
    return await this.webSocketService.send(
      WebSocketMessages.PREVIEW_TEMPLATE,
      data,
    );
  }

  /**
   * Only process the path
   * @throws If the template needs a model and no model is passed
   */
  async path(template: ITemplate, model: IModel | null): Promise<string> {
    const data: any = { path: template.path };
    if (template.needsModel()) {
      if (!model) {
        throw new Error('Model should be defined for this template');
      }
      data.model = model.id;
    }
    return await this.webSocketService.send(
      WebSocketMessages.PREVIEW_PATH,
      data,
    );
  }
}
