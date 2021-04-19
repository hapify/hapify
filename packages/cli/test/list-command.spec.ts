import 'reflect-metadata';
import { expect } from '@hapi/code';

import 'mocha';
import { CLI, SamplesDir, Sandbox } from './helpers';

describe('list command', () => {
  it('success', async () => {
    const response = await CLI('list', ['--dir', SamplesDir, '--depth', '1']);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['HapiJS', 'Angular']);
  });
  it('depth too low', async () => {
    const response = await CLI('list', ['--dir', SamplesDir, '--depth', '0']);

    expect(response.code).to.equal(1);
    expect(response.stdout).to.be.empty();
    expect(response.stderr).to.contains('No channel found');
  });
  it('empty folder', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();

    const response = await CLI('list', ['--dir', sandbox.getPath()]);

    expect(response.code).to.equal(1);
    expect(response.stdout).to.be.empty();
    expect(response.stderr).to.contains('No channel found');
  });
  it('malformed config file', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();
    sandbox.touch('hapify.json', JSON.stringify({}));

    const response = await CLI('list', ['--dir', sandbox.getPath()]);

    expect(response.code).to.equal(1);
    expect(response.stdout).to.be.empty();
    expect(response.stderr).to.contains(
      'Version undefined of channel is not supported',
    ); // JSON is empty
  });
});
