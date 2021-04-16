import { Service } from 'typedi';
import Joi from 'joi';
import { InfoService } from '../Info';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGetInfoHandlerOutput } from '../../interface/WebSocketHandlers';

@Service()
export class GetInfoHandlerService implements IWebSocketHandler<{}, WebSocketGetInfoHandlerOutput> {
	constructor(private infoService: InfoService) {}

	canHandle(message: WebSocketMessage<{}>): boolean {
		return message.id === 'get:info';
	}

	validator(): Joi.Schema {
		return Joi.any();
	}

	async handle(message: WebSocketMessage<{}>): Promise<WebSocketGetInfoHandlerOutput> {
		return {
			project: await this.infoService.project(),
			limits: await this.infoService.limits(),
		};
	}
}
