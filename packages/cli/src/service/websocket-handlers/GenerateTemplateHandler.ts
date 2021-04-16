import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGenerateTemplateHandlerInput } from '../../interface/WebSocketHandlers';

@Service()
export class GenerateTemplateHandlerService implements IWebSocketHandler<WebSocketGenerateTemplateHandlerInput, void> {
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService, private writerService: WriterService) {}

	canHandle(message: WebSocketMessage<WebSocketGenerateTemplateHandlerInput>): boolean {
		return message.id === 'gen:template';
	}

	validator(): Joi.Schema {
		return Joi.object({
			channel: Joi.string().required(),
			template: Joi.string().required(),
		});
	}

	async handle(message: WebSocketMessage<WebSocketGenerateTemplateHandlerInput>): Promise<void> {
		// Get channel
		const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
		if (!channel) {
			throw new Error(`Unable to find channel ${message.data.channel}`);
		}
		// Get template
		const template = channel.templates.find((t) => t.path === message.data.template);
		if (!template) {
			throw new Error(`Unable to find template ${message.data.template}`);
		}
		const results = await this.generatorService.runTemplate(template);
		await this.writerService.writeMany(channel.path, results);
	}
}
