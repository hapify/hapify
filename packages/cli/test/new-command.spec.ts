import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';
import { IStorableCompactProject } from '../src/interface/Storage';
import { IConfig } from '../src/interface/Config';

describe('new command', () => {
	it('success by slug', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate',
			'hapijs_tractr',
			'--no-presets',
			'--project-name',
			'The Name',
			'--project-desc',
			'The Description',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
	});
	it('success by id', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate-id',
			'5c77197a98ebdb001075f3a5',
			'--no-presets',
			'--project-name',
			'The Name',
			'--project-desc',
			'The Description',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
	});
	it('success by url (x2) with preset', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-hapijs.git',
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-ngx-components.git',
			'--preset',
			'60104aabe0fe50001033f10e', // User
			'--project-name',
			'The Name',
			'--project-desc',
			'The Description',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 2 new dynamic boilerplates');

		expect(sandbox.dirExists(['boilerplate-hapijs'])).to.be.true();
		expect(sandbox.fileExists(['boilerplate-hapijs', 'hapify.json'])).to.be.true();

		expect(sandbox.dirExists(['boilerplate-ngx-components'])).to.be.true();
		expect(sandbox.fileExists(['boilerplate-ngx-components', 'hapify.json'])).to.be.true();
		expect(sandbox.fileExists(['boilerplate-ngx-components', 'hapify-models.json'])).to.be.false();

		const hapifyJSON1 = sandbox.getJSONFileContent<IConfig>(['boilerplate-hapijs', 'hapify.json']);
		const hapifyJSON2 = sandbox.getJSONFileContent<IConfig>(['boilerplate-ngx-components', 'hapify.json']);

		// Ensure both config are using the same local project
		expect(sandbox.getPath(['boilerplate-hapijs', hapifyJSON1.project])).to.equal(sandbox.getPath(['boilerplate-ngx-components', hapifyJSON2.project]));

		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['boilerplate-hapijs', hapifyJSON1.project]);
		expect(hapifyModelsJSON.models.length).to.equal(1);
		expect(hapifyModelsJSON.models.some((m) => m.name.toLowerCase() === 'user')).to.be.true();
	});
	it('success with presets', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate',
			'hapijs_tractr',
			'--preset',
			'60104aabe0fe50001033f10e', // User
			'--preset',
			'60104aabe0fe50001033f10f', // Place
			'--project-name',
			'The Name',
			'--project-desc',
			'The Description',
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.contains('Created 1 new dynamic boilerplate');

		expect(sandbox.fileExists(['hapify.json'])).to.be.true();
		expect(sandbox.fileExists(['hapify-models.json'])).to.be.true();
		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['hapify-models.json']);
		expect(hapifyModelsJSON.models.length).to.least(2);
		expect(hapifyModelsJSON.models.some((m) => m.name.toLowerCase() === 'user')).to.be.true();
		expect(hapifyModelsJSON.models.some((m) => m.name.toLowerCase() === 'place')).to.be.true();
	});
	it('busy folder', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();
		sandbox.touch('hapify.json', JSON.stringify({}));

		const response = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate',
			'hapijs_tractr',
			'--no-presets',
			'--project-name',
			'The Name',
			'--project-desc',
			'The Description',
		]);

		expect(response.code).to.equal(1);
		expect(response.stdout).to.be.empty();
		expect(response.stderr).to.contains('folder is not empty');
	});
});
