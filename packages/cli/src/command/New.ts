import * as Path from 'path';

import { Command } from 'commander';
import * as Fs from 'fs-extra';
import { Container } from 'typedi';

import { ChannelsService } from '../service/Channels';
import { LoggerService } from '../service/Logger';
import { OptionsService } from '../service/Options';
import { cHigh, cImportant, cMedium, cPath } from './helpers';
import {
  AskBoilerplate,
  BoilerplateQuery,
  FindBoilerplate,
} from './question/Boilerplate';
import { ApplyPreset, AskPreset } from './question/Preset';
import {
  AskLocalProject,
  AskRemoteProject,
  ProjectQuery,
} from './question/Project';

const SimpleGit = require('simple-git/promise');

const GetDirectories = (s: string) =>
  Fs.readdirSync(s)
    .map((n: string) => Path.join(s, n))
    .filter((d: string) => Fs.lstatSync(d).isDirectory());

export async function NewCommand(cmd: Command) {
  // Get services
  const options = Container.get(OptionsService);
  const logger = Container.get(LoggerService);
  const channelsService = Container.get(ChannelsService);

  options.setCommand(cmd);

  // ---------------------------------
  // Action starts
  const qProject: ProjectQuery = {};
  const qBoilerplate: BoilerplateQuery = {};

  // ---------------------------------
  // Verify current dir
  const currentDir = options.dir();
  const files = Fs.readdirSync(currentDir);
  if (files.length) {
    throw new Error(
      'Current folder is not empty, cannot create a new project.',
    );
  }

  // =================================
  // Get boilerplate
  await AskBoilerplate(cmd, qBoilerplate);

  // =================================
  // Get presets
  const qPresets = await AskPreset(cmd);

  // =================================
  // Get boilerplate URL
  await FindBoilerplate(qBoilerplate);

  // =================================
  // Clone git repo
  // Init & validate channel for this new folder
  const git = SimpleGit(currentDir);
  const boilerplatesCount = qBoilerplate.urls.length;
  if (boilerplatesCount > 1) {
    for (const url of qBoilerplate.urls) {
      await git.clone(url);
    }
    const dirs = GetDirectories(currentDir);
    for (const dir of dirs) {
      Fs.removeSync(Path.join(dir, '.git'));
    }
  } else {
    await git.clone(qBoilerplate.urls[0], currentDir);
    Fs.removeSync(Path.join(currentDir, '.git'));
  }

  // =================================
  // Use only one local project in case of multiple boilerplates
  // If a single boilerplate contains more than one channel, we assume they use the same project
  const projectIsLocal = await channelsService.mergeLocalProjects();

  // =================================
  // Get project and store info
  if (projectIsLocal) {
    await AskLocalProject(cmd, qProject);
    // Get the the first channel's project and change its name
    const { project } = (await channelsService.channels())[0];
    project.setNameAndDescription(qProject.name, qProject.description);
    await project.save();
  } else {
    await AskRemoteProject(cmd, qProject);
    await channelsService.changeRemoteProject(qProject.id);
  }

  // =================================
  // Get models and apply presets if necessary
  await ApplyPreset(qPresets);

  logger.success(
    `Created ${boilerplatesCount} new dynamic boilerplate${
      boilerplatesCount > 1 ? 's' : ''
    } in ${cPath(currentDir)}.
Run ${cMedium('hpf use')} to connect a remote project (optional).
Run ${cHigh('hpf serve')} to edit models and templates.
Run ${cImportant('hpf generate')} to generate the source code.`,
  );
  // Action Ends
  // ---------------------------------
}
