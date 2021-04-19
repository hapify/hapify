import { Command } from 'commander';
import { Container } from 'typedi';

import { ChannelsService } from '../service/Channels';
import { HttpServerService } from '../service/HttpServer';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { cPath } from './helpers';

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
