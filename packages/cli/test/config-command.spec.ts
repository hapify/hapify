import 'reflect-metadata';
import { expect } from '@hapi/code';

import 'mocha';
import { RemoteConfig } from '../src/config/Remote';
import { CLI, GetGlobalConfig } from './helpers';

describe('config command', () => {
  it('set values', async () => {
    const key = 'Fain9kaeChire3zohghahveicie0shaewaiPh8aed6tha3AK';
    const url = 'http://localhost:9999';
    const originalGlobalConfig = GetGlobalConfig();
    const originalUrl = originalGlobalConfig.apiUrl || RemoteConfig.uri;
    const originalKey = originalGlobalConfig.apiKey || key;

    const response = await CLI('config', ['--apiKey', key, '--apiUrl', url]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['Did update global configuration']);

    const globalConfig = GetGlobalConfig();
    expect(globalConfig.apiKey).to.equal(key);
    expect(globalConfig.apiUrl).to.equal(url);

    // Restore original config
    const response2 = await CLI('config', [
      '--apiKey',
      originalKey,
      '--apiUrl',
      originalUrl,
    ]);
    expect(response2.code).to.equal(0);
  });

  it('set wrong key', async () => {
    const response = await CLI('config', ['--apiKey', 'wrong_format']);
    expect(response.code).to.equal(1);
    expect(response.stdout).to.be.empty();
    expect(response.stderr).to.contains([
      'Global config format error',
      'apiKey',
    ]);
  });

  it('set wrong url', async () => {
    const response = await CLI('config', ['--apiUrl', '']);
    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['Nothing update']);
  });
});
