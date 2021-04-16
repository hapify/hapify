import { Container } from 'typedi';
import { Command } from 'commander';
import { cMedium, cPath } from './helpers';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { ChannelDescriptionQuery, DescribeChannel } from './question/Channel';
import { Channel } from '../class/Channel';
import { Project } from '../class/Project';
import { AskLocalProject, ProjectQuery } from './question/Project';

export async function InitCommand(cmd: Command) {
	// Get services
	const options = Container.get(OptionsService);
	const logger = Container.get(LoggerService);

	options.setCommand(cmd);

	const qProject: ProjectQuery = {};
	const qChannelDescription: ChannelDescriptionQuery = {};

	// =================================
	// Get project
	await AskLocalProject(cmd, qProject);

	// =================================
	// Describe channel
	await DescribeChannel(cmd, qChannelDescription);

	// =================================
	// Init channel to save
	const channel = await Channel.create(options.dir(), qChannelDescription.name, qChannelDescription.description, qChannelDescription.logo);

	// =================================
	// Create project from channel and save
	await Project.createLocalForChannel(channel, qProject.name, qProject.description);
	await channel.save();

	logger.success(`Initialized a channel in ${cPath(options.dir())}.
Run ${cMedium('hpf use')} to connect a remote project (optional)`);
	// Action Ends
	// ---------------------------------
}
