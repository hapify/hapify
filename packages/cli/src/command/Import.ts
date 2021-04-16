import { Container } from 'typedi';
import { Command } from 'commander';
import { OptionsService } from '../service/Options';
import { ChannelsService } from '../service/Channels';
import { LoggerService } from '../service/Logger';
import { ApplyPreset, AskPreset } from './question/Preset';

export async function ImportCommand(cmd: Command) {
	// Get services
	const options = Container.get(OptionsService);
	const logger = Container.get(LoggerService);
	const channelsService = Container.get(ChannelsService);

	options.setCommand(cmd);

	// ---------------------------------
	// Action starts
	await channelsService.ensureSameProject();
	await channelsService.ensureSameDefaultFields();

	// =================================
	// Get presets
	const qPresets = await AskPreset(cmd);

	// =================================
	// Get models and apply presets if necessary
	const success = await ApplyPreset(qPresets);

	if (success) {
		logger.success(`Did apply ${qPresets.length} preset(s)`);
	} else {
		logger.error('Operation aborted');
	}
	// Action Ends
	// ---------------------------------
}
