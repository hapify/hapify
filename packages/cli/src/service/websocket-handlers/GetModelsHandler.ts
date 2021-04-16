import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { IModel } from '../../interface/Generator';

@Service()
export class GetModelsHandlerService implements IWebSocketHandler<{}, IModel[]> {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocketMessage<{}>): boolean {
		return message.id === 'get:models';
	}

	validator(): Joi.Schema {
		return Joi.any();
	}

	async handle(message: WebSocketMessage<{}>): Promise<IModel[]> {
		return (await this.channelsService.modelsCollection()).toObject();
	}
}
