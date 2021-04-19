import { Command } from 'commander';
import { Container } from 'typedi';

import { Channel } from '../class/Channel';
import { ChannelsService } from '../service/Channels';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { cChannel, cModel, cPath, logChannel } from './helpers';

export async function ListCommand(cmd: Command) {
  // Get services
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);
  const channelsService = Container.get(ChannelsService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  const channels = await channelsService.channels();

  for (const channel of channels) {
    logChannel(channel);
  }

  // Group channels by models collections
  const modelsCollections: { [s: string]: Channel[] } = {};
  for (const channel of channels) {
    if (
      typeof modelsCollections[channel.modelsCollection.path] === 'undefined'
    ) {
      modelsCollections[channel.modelsCollection.path] = [];
    }
    modelsCollections[channel.modelsCollection.path].push(channel);
  }

  const modelsPaths = Object.keys(modelsCollections);
  for (const modelsPath of modelsPaths) {
    const c: Channel[] = modelsCollections[modelsPath];
    const mc = c.length > 1;
    const m = await c[0].modelsCollection.list();
    const mm = m.length > 1;
    let message = `Channel${mc ? 's' : ''} ${c
      .map((c) => cChannel(c.name))
      .join(', ')} use${mc ? '' : 's'} models of ${cPath(modelsPath)}`;
    if (m.length === 0) {
      message += `\nThere is no model yet.`;
    } else {
      message += `\nThe model${mm ? 's are' : ' is'}:\n- ${m
        .map((m) => cModel(m.name))
        .join('\n- ')}`;
    }
    logger.newLine().info(message);
  }
  logger.newLine();

  // Action Ends
  // ---------------------------------
}
