import { exec } from 'child_process';
import * as util from 'util';

import { Command } from 'commander';
import { prompt, Separator } from 'inquirer';
import { SimpleGit } from 'simple-git/promise';
import { Container } from 'typedi';

import { OptionsService } from '../../service/Options';

export interface DiffQuery {
  from?: string;
  to?: string;
  source?: string;
  destination?: string;
}
export async function AskDiff(cmd: Command, qDiff: DiffQuery, git: SimpleGit) {
  const branches = await git.branchLocal();

  qDiff.source = (
    await prompt([
      {
        name: 'source',
        message: 'Choose a source branch',
        type: 'list',
        choices: branches.all,
        default: 'hapify',
      },
    ])
  ).source;

  const commits = (
    await git.log([qDiff.source, '-n', '20', '--'])
  ).all.map((c) => ({ name: `[${c.date}] ${c.message}`, value: c.hash }));

  const fromAnswer = (await prompt([
    {
      name: 'from',
      message: 'Choose the first commit',
      type: 'list',
      choices: [
        { name: 'Enter a commit hash', value: null },
        new Separator(),
        ...commits,
      ],
      default: commits.length > 1 ? commits[1].value : null,
      when: () => commits.length > 0,
    },
    {
      name: 'fromHash',
      message: 'Enter the first commit hash',
      when: (answer: any) => !answer.from,
      validate: (input) => input.length > 0,
    },
  ])) as { from?: string; fromHash?: string };
  qDiff.from = fromAnswer.fromHash || fromAnswer.from;

  const toAnswer = (await prompt([
    {
      name: 'to',
      message: 'Choose the second commit',
      type: 'list',
      choices: [
        { name: 'Enter a commit hash', value: null },
        new Separator(),
        ...commits,
      ],
      default: commits.length > 0 ? commits[0].value : null,
      when: () => commits.length > 0,
    },
    {
      name: 'toHash',
      message: 'Enter the second commit hash',
      when: (answer: any) => !answer.to,
      validate: (input) => input.length > 0,
    },
  ])) as { to?: string; toHash?: string };
  qDiff.to = toAnswer.toHash || toAnswer.to;

  qDiff.destination = (
    await prompt([
      {
        name: 'destination',
        message: 'Choose a destination branch',
        type: 'list',
        choices: branches.all,
        default: 'develop',
      },
    ])
  ).destination;
}
export async function ApplyDiff(
  qDiff: DiffQuery,
  git: SimpleGit,
): Promise<string> {
  const options = Container.get(OptionsService);
  const command = `git format-patch --stdout ${qDiff.from}..${qDiff.to} | git am -3 -k`;
  const { confirm } = await prompt([
    {
      name: 'confirm',
      message: `Confirm run command: "${command}" on branch ${qDiff.destination}`,
      type: 'confirm',
      default: false,
    },
  ]);

  if (confirm) {
    await git.checkout(qDiff.destination);
    const { stdout, stderr } = await util.promisify(exec)(command, {
      cwd: options.dir(),
    });
    if (stderr && stderr.length) {
      throw new Error(`${stderr}\n${stdout}`);
    }
    return stdout;
  }

  return null;
}
