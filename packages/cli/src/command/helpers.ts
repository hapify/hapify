import chalk from 'chalk';
import { Container } from 'typedi';

import { Channel } from '../class/Channel';
import { LoggerService } from '../service/Logger';

// Common methods
export const logChannel = (channel: Channel) => {
  const logger = Container.get(LoggerService);
  logger.info(
    `Found channel ${chalk.yellow(channel.name)} in ${chalk.blueBright(
      channel.path,
    )}`,
  );
};
export const cChannel = chalk.yellow;
export const cModel = chalk.magentaBright;
export const cPath = chalk.blueBright;
export const cImportant = chalk.green.bold;
export const cHigh = chalk.green;
export const cMedium = chalk.yellow;
