import { Service } from 'typedi';
import { ChannelsService } from '../Channels';
import Joi from 'joi';
import { IWebSocketHandler, WebSocketMessage } from '../../interface/WebSocket';
import { ChannelSchema } from '../../interface/schema/Channel';
import { IChannel } from '../../interface/Objects';

@Service()
export class SetChannelsHandlerService implements IWebSocketHandler<IChannel[], void> {
	constructor(private channelsService: ChannelsService) {}

	canHandle(message: WebSocketMessage<IChannel[]>): boolean {
		return message.id === 'set:channels';
	}

	validator(): Joi.Schema {
		return Joi.array().items(ChannelSchema).min(0);
	}

	async handle(message: WebSocketMessage<IChannel[]>): Promise<void> {
		// Existing channels
		const channels = await this.channelsService.channels();
		// New contents
		const toSaves = message.data;
		// For each new content, get the corresponding channel and save it
		for (const toSave of toSaves) {
			const channel = channels.find((c) => c.id === toSave.id);
			// Scream if not found
			if (!channel) {
				throw new Error(`Channel not found: ${toSave.name}`);
			}
			channel.fromObject(toSave);
			await channel.save();
		}
	}
}
