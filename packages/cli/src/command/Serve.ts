import { Container } from 'typedi';
import { Command } from 'commander';
import { cPath } from './helpers';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';
import { HttpServerService } from '../service/HttpServer';
import { ChannelsService } from '../service/Channels';

export async function ServeCommand(cmd: Command) {
	// Get services
	const options = Container.get(OptionsService);
	const logger = Container.get(LoggerService);
	const http = Container.get(HttpServerService);
	const channelsService = Container.get(ChannelsService);

	options.setCommand(cmd);

	// ---------------------------------
	// Action starts
	await channelsService.ensureSameProject();
	await channelsService.ensureSameDefaultFields();
	await http.serve();
	logger.info(`Server is running at: ${cPath(http.url())}`);
	if (options.open()) {
		await http.open();
	}
	// Action Ends
	// ---------------------------------
}
