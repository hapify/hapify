import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, GetGlobalConfig } from './helpers';

describe('key command', () => {
	it('set key', async () => {
		const key = 'Fain9kaeChire3zohghahveicie0shaewaiPh8aed6tha3AK';
		const originalGlobalConfig = GetGlobalConfig();

		const response = await CLI('key', [key]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains(['Did update global api key']);

		const globalConfig = GetGlobalConfig();
		expect(globalConfig.apiKey).to.equal(key);

		// Restore original config
		if (originalGlobalConfig.apiKey) {
			const response2 = await CLI('key', [originalGlobalConfig.apiKey]);
			expect(response2.code).to.equal(0);
		}
	});

	it('set wrong key', async () => {
		const response = await CLI('key', ['wrong_format']);
		expect(response.code).to.equal(1);
		expect(response.stdout).to.be.empty();
		expect(response.stderr).to.contains(['Global config format error', 'apiKey']);
	});
});
