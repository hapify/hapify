import { Service } from 'typedi';
import Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { Model } from '../../class/Model';
import { IModel } from '../../interface/Generator';
import { WebSocketNewModelHandlerInput } from '../../interface/WebSocketHandlers';

@Service()
export class NewModelHandlerService implements IWebSocketHandler<WebSocketNewModelHandlerInput, IModel> {
	constructor(private infoService: InfoService) {}

	canHandle(message: WebSocketMessage<WebSocketNewModelHandlerInput>): boolean {
		return message.id === 'new:model';
	}

	validator(): Joi.Schema {
		return Joi.object({
			name: Joi.string().required(),
		});
	}

	async handle(message: WebSocketMessage<WebSocketNewModelHandlerInput>): Promise<IModel> {
		return new Model({
			id: Model.generateTempId(),
			name: message.data.name,
			fields: await this.infoService.fields(),
			accesses: Model.defaultAccesses(),
		}).toObject();
	}
}
