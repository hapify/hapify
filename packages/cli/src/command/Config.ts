import { Command } from 'commander';
import { Container } from 'typedi';

import { GlobalConfigService } from '../service/GlobalConfig';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';

export async function ConfigCommand(cmd: Command) {
  // Get services
  const globalConfig = Container.get(GlobalConfigService);
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  // Get actual values
  const data = globalConfig.getData();

  const updates = [];

  // Update values
  if (cmd.apiKey) {
    data.apiKey = cmd.apiKey;
    updates.push('apiKey');
  }
  if (cmd.apiUrl) {
    data.apiUrl = cmd.apiUrl;
    updates.push('apiUrl');
  }

  // Store values
  globalConfig.setData(data);

  if (updates.length) {
    logger.success(`Did update global configuration: ${updates.join(', ')}`);
  } else {
    logger.warning(`Nothing updated`);
  }
  // Action Ends
  // ---------------------------------
}
