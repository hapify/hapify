import { Command } from 'commander';
import { Container } from 'typedi';

import { ChannelsService } from '../service/Channels';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { cChannel, cHigh } from './helpers';
import {
  AskRemoteProject,
  ProjectQuery,
  SetupRemoteProject,
} from './question/Project';

export async function UseCommand(cmd: Command) {
  // Get services
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);
  const channelsService = Container.get(ChannelsService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  const qProject: ProjectQuery = {};

  // =================================
  // Get project
  await AskRemoteProject(cmd, qProject);

  // =================================
  // Create project if necessary
  await SetupRemoteProject(qProject);

  // =================================
  // Set project in channel and save
  await channelsService.changeRemoteProject(qProject.id);

  // =================================
  // Log changes
  const channels = await channelsService.channels();
  for (const channel of channels) {
    logger.success(
      `Did set project ${cHigh(qProject.id)} for channel ${cChannel(
        channel.name,
      )}`,
    );
  }
  // Action Ends
  // ---------------------------------
}
