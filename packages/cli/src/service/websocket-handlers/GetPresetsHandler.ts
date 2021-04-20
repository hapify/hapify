import Joi from 'joi';
import { Service } from 'typedi';

import { IPreset } from '../../interface/Objects';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { EmptyObject } from '../../interface/WebSocketHandlers';
import { PresetsService } from '../Presets';

@Service()
export class GetPresetsHandlerService
  implements IWebSocketHandler<EmptyObject, IPreset[]> {
  constructor(private presetsService: PresetsService) {}

  canHandle(message: WebSocketMessage<EmptyObject>): boolean {
    return message.id === 'get:presets';
  }

  validator(): Joi.Schema {
    return Joi.any();
  }

  async handle(): Promise<IPreset[]> {
    return (await this.presetsService.collection()).toObject();
  }
}
