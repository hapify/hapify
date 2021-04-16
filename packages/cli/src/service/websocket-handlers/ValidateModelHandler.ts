import { Service } from 'typedi';
import { ValidatorService } from '../Validator';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { ModelSchema } from '../../interface/schema/Model';
import { Validator } from '../../interface/Validator';
import { WebSocketValidateModelHandlerInput } from '../../interface/WebSocketHandlers';

@Service()
export class ValidateModelHandlerService implements IWebSocketHandler<WebSocketValidateModelHandlerInput, Validator> {
	constructor(private validatorService: ValidatorService) {}

	canHandle(message: WebSocketMessage<WebSocketValidateModelHandlerInput>): boolean {
		return message.id === 'val:model';
	}

	validator(): Joi.Schema {
		return Joi.object({
			model: ModelSchema,
			content: Joi.string().required(),
		});
	}

	async handle(message: WebSocketMessage<WebSocketValidateModelHandlerInput>): Promise<Validator> {
		// From content
		return await this.validatorService.run(message.data.content, message.data.model);
	}
}
