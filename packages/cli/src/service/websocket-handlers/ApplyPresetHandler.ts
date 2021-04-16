import { Service } from 'typedi';
import { PresetsService } from '../Presets';
import Joi from 'joi';
import { Model } from '../../class/Model';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { ModelSchema } from '../../interface/schema/Model';
import { IModel } from '../../interface/Generator';
import { WebSocketApplyPresetHandlerInput, WebSocketApplyPresetHandlerOutput } from '../../interface/WebSocketHandlers';

@Service()
export class ApplyPresetHandlerService implements IWebSocketHandler<WebSocketApplyPresetHandlerInput, WebSocketApplyPresetHandlerOutput> {
	constructor(private presetsService: PresetsService) {}

	canHandle(message: WebSocketMessage<WebSocketApplyPresetHandlerInput>): boolean {
		return message.id === 'apply:presets';
	}

	validator(): Joi.Schema {
		return Joi.object({
			models: Joi.array().items(ModelSchema).required().min(0),
		});
	}

	async handle(message: WebSocketMessage<WebSocketApplyPresetHandlerInput>): Promise<WebSocketApplyPresetHandlerOutput> {
		const models = message.data.models.map((m: IModel) => new Model(m));

		const results = await this.presetsService.apply(models);

		return {
			updated: results.updated.map((m) => m.toObject()),
			created: results.created.map((m) => m.toObject()),
		};
	}
}
