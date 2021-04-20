import Joi from 'joi';
import { Service } from 'typedi';

import { ModelSchema } from '../../interface/schema/Model';
import { Validator } from '../../interface/Validator';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketValidateModelHandlerInput } from '../../interface/WebSocketHandlers';
import { ValidatorService } from '../Validator';

@Service()
export class ValidateModelHandlerService
  implements IWebSocketHandler<WebSocketValidateModelHandlerInput, Validator> {
  constructor(private validatorService: ValidatorService) {}

  canHandle(
    message: WebSocketMessage<WebSocketValidateModelHandlerInput>,
  ): boolean {
    return message.id === 'val:model';
  }

  validator(): Joi.Schema {
    return Joi.object({
      model: ModelSchema,
      content: Joi.string().required(),
    });
  }

  handle(
    message: WebSocketMessage<WebSocketValidateModelHandlerInput>,
  ): Validator {
    // From content
    return this.validatorService.run(message.data.content, message.data.model);
  }
}
