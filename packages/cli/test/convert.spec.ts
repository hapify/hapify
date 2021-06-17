import 'reflect-metadata';
import { expect } from '@hapi/code';

import 'mocha';
import { CLI, Sandbox } from './helpers';

describe('test versions conversions', () => {
  it('channel & project v1', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();
    sandbox.cloneFrom('test/versions/v1/hapijs');

    const response = await CLI('list', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['HapiJS', 'user', 'profile']);
  });

  it('channel & project v2', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();
    sandbox.cloneFrom('test/versions/v2/hapijs');

    const response = await CLI('list', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['HapiJS', 'user', 'profile']);
  });

  it('channel & project v3', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();
    sandbox.cloneFrom('test/versions/v3/hapijs');

    const response = await CLI('list', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['HapiJS', 'user', 'profile']);
  });
});
