import { Service } from 'typedi';
import { PresetsService } from '../Presets';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IPreset } from '../../interface/Objects';

@Service()
export class GetPresetsHandlerService implements IWebSocketHandler<{}, IPreset[]> {
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
