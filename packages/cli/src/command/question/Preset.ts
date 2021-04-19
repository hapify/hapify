import { Command } from 'commander';
import * as Inquirer from 'inquirer';
import { Container } from 'typedi';

import { ChannelsService } from '../../service/Channels';
import { LoggerService } from '../../service/Logger';
import { PresetsService } from '../../service/Presets';

export async function AskPreset(cmd: Command): Promise<string[]> {
  const presetsCollection = await Container.get(PresetsService).collection();
  let qPresets: string[] = [];

  if (cmd.presets !== false) {
    if (cmd.preset && cmd.preset.length) {
      qPresets = cmd.preset;
    } else {
      // Get presets from remote
      const list = (await presetsCollection.list()).map((p: any) => ({
        name: p.name,
        value: p.id,
      }));

      qPresets = (
        await Inquirer.prompt([
          {
            name: 'presets',
            message: 'Choose some presets to preload in your project',
            type: 'checkbox',
            choices: list,
            when: () => list.length > 0,
          },
        ])
      ).presets;
    }
  }

  return qPresets;
}
export async function ApplyPreset(qPresets: string[]): Promise<boolean> {
  const logger = Container.get(LoggerService);
  const presets = Container.get(PresetsService);
  const presetsCollection = await presets.collection();
  const modelsCollection = await Container.get(
    ChannelsService,
  ).modelsCollection();

  if (qPresets && qPresets.length) {
    const models = await modelsCollection.list();
    // If the project already has models, ignore add presets
    if (models.length) {
      logger.warning('Project already contains models. Ignore presets import.');
      return false;
    }
    // Get and apply presets
    for (const id of qPresets) {
      const preset = await presetsCollection.get(id);
      const results = await presets.apply(preset.models);
      await modelsCollection.add(results.created);
      await modelsCollection.update(results.updated);
    }
    // Save models
    await modelsCollection.save();
    return true;
  }
}
