import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketPathPreviewHandlerInput } from '../../interface/WebSocketHandlers';

@Service()
export class PathPreviewHandlerService implements IWebSocketHandler<WebSocketPathPreviewHandlerInput, string> {
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService) {}

	canHandle(message: WebSocketMessage<WebSocketPathPreviewHandlerInput>): boolean {
		return message.id === 'prv:path';
	}

	validator(): Joi.Schema {
		return Joi.object({
			model: Joi.string(),
			path: Joi.string().required(),
		});
	}

	async handle(message: WebSocketMessage<WebSocketPathPreviewHandlerInput>): Promise<string> {
		// Get model, if any
		const model = message.data.model ? await (await this.channelsService.modelsCollection()).find(message.data.model) : null;
		// Compute the path
		return await this.generatorService.pathPreview(message.data.path, model);
	}
}
