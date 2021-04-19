import { Command } from 'commander';
import { Container } from 'typedi';

import { ChannelsService } from '../service/Channels';
import { GeneratorService } from '../service/Generator';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { WriterService } from '../service/Writer';
import { cChannel, cHigh, logChannel } from './helpers';

export async function GenerateCommand(cmd: Command) {
  // Get services
  const generator = Container.get(GeneratorService);
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);
  const writer = Container.get(WriterService);
  const channelsService = Container.get(ChannelsService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  const channels = await channelsService.channels();

  for (const channel of channels) {
    logChannel(channel);
  }

  for (const channel of channels) {
    const results = await generator.runChannel(channel);
    await writer.writeMany(channel.path, results);
    logger.success(
      `Generated ${cHigh(`${results.length} files`)} for channel ${cChannel(
        channel.name,
      )}`,
    );
  }
  // Action Ends
  // ---------------------------------
}
