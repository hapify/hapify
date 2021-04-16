import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import { GeneratorService } from '../Generator';
import { WriterService } from '../Writer';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { WebSocketGenerateChannelHandlerInput } from '../../interface/WebSocketHandlers';

@Service()
export class GenerateChannelHandlerService implements IWebSocketHandler<WebSocketGenerateChannelHandlerInput, void> {
	constructor(private channelsService: ChannelsService, private generatorService: GeneratorService, private writerService: WriterService) {}

	canHandle(message: WebSocketMessage<WebSocketGenerateChannelHandlerInput>): boolean {
		return message.id === 'gen:channel';
	}

	validator(): Joi.Schema {
		return Joi.object({
			channel: Joi.string().required(),
		});
	}

	async handle(message: WebSocketMessage<WebSocketGenerateChannelHandlerInput>): Promise<void> {
		// Get channel
		const channel = (await this.channelsService.channels()).find((c) => c.id === message.data.channel);
		if (!channel) {
			throw new Error(`Unable to find channel ${message.data.channel}`);
		}
		const results = await this.generatorService.runChannel(channel);
		await this.writerService.writeMany(channel.path, results);
	}
}
