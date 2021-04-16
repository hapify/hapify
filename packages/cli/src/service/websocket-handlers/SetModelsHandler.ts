import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { ModelSchema } from '../../interface/schema/Model';
import { IModel } from '../../interface/Generator';

@Service()
export class SetModelsHandlerService implements IWebSocketHandler<IModel[], void> {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocketMessage<IModel[]>): boolean {
		return message.id === 'set:models';
	}

	validator(): Joi.Schema {
		return Joi.array().items(ModelSchema).min(0);
	}

	async handle(message: WebSocketMessage<IModel[]>): Promise<void> {
		const modelsCollection = await this.channelsService.modelsCollection();
		modelsCollection.fromObject(message.data);
		await modelsCollection.save();
	}
}
