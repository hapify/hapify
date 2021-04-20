import { Command } from 'commander';
// eslint-disable-next-line import/no-named-as-default
import SimpleGit from 'simple-git/promise';
import { Container } from 'typedi';

import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { ApplyDiff, AskDiff, DiffQuery } from './question/Diff';

export async function PatchCommand(cmd: Command) {
  // Get services
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  const qDiif: DiffQuery = {};
  const currentDir = options.dir();

  // =================================
  // Clone git repo
  const git = SimpleGit(currentDir);

  // =================================
  // Get source and destination
  await AskDiff(cmd, qDiif, git);

  // =================================
  // Run patch
  const result = await ApplyDiff(qDiif, git);
  if (result === null) {
    logger.info('Aborted');
  } else {
    logger.success(`Success:\n${result}`);
  }

  // Action Ends
  // ---------------------------------
}
