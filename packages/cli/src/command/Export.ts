import * as Path from 'path';

import { Command } from 'commander';
import { Container } from 'typedi';

import { Channel } from '../class/Channel';
import { GeneratorService } from '../service/Generator';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { WriterService } from '../service/Writer';
import { cChannel, cHigh, cPath, logChannel } from './helpers';

export async function ExportCommand(cmd: Command) {
  // Get services
  const generator = Container.get(GeneratorService);
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);
  const writer = Container.get(WriterService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  const channel: Channel = new Channel(options.dir());
  await channel.load();
  logChannel(channel);

  const outputPath =
    options.output() || Path.join(options.dir(), `${channel.name}.zip`);

  const results = await generator.runChannel(channel);
  await writer.zip(outputPath, results);
  logger.success(
    `Generated and zipped ${cHigh(
      `${results.length} files`,
    )} for channel ${cChannel(channel.name)} to ${cPath(outputPath)}`,
  );
  // Action Ends
  // ---------------------------------
}
