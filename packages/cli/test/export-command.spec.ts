import 'reflect-metadata';
import { expect } from '@hapi/code';

import 'mocha';
import { CLI, SampleHapiJSDir, Sandbox } from './helpers';

describe('export command', () => {
  it('success', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();

    const response = await CLI('export', [
      '--dir',
      SampleHapiJSDir,
      '--output',
      sandbox.getPath(['output.zip']),
    ]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['Generated and zipped']);

    expect(sandbox.fileExists(['output.zip'])).to.be.true();
  });
});
