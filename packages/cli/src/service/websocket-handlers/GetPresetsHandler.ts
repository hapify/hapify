import Joi from 'joi';
import { Service } from 'typedi';

import { IPreset } from '../../interface/Objects';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { PresetsService } from '../Presets';

@Service()
export class GetPresetsHandlerService
  implements IWebSocketHandler<{}, IPreset[]> {
  constructor(private presetsService: PresetsService) {}

  canHandle(message: WebSocketMessage<{}>): boolean {
    return message.id === 'get:presets';
  }

  validator(): Joi.Schema {
    return Joi.any();
  }

  async handle(message: WebSocketMessage<{}>): Promise<IPreset[]> {
    return (await this.presetsService.collection()).toObject();
  }
}
