import { Container } from 'typedi';
import { Command } from 'commander';
import { GlobalConfigService } from '../service/GlobalConfig';
import { OptionsService } from '../service/Options';
import { LoggerService } from '../service/Logger';

export async function KeyCommand(key: string, cmd: Command) {
	// Get services
	const globalConfig = Container.get(GlobalConfigService);
	const options = Container.get(OptionsService);
	const logger = Container.get(LoggerService);

	options.setCommand(cmd);

	// ---------------------------------
	// Action starts

	// Get actual values
	const data = globalConfig.getData();
	data.apiKey = key;

	// Store values
	globalConfig.setData(data);

	logger.success(`Did update global api key`);
	// Action Ends
	// ---------------------------------
}
