import 'reflect-metadata';
import { expect } from '@hapi/code';
import 'mocha';
import { CLI, Sandbox } from './helpers';
import { IStorableCompactProject } from '../src/interface/Storage';

describe('import command', () => {
	it('success', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', [
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

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

		// Generate code
		const response = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'60104aabe0fe50001033f10e', // User
			'--preset',
			'60104aabe0fe50001033f10f', // Place
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.be.contains(['apply 2 preset']);

		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['hapify-models.json']);
		expect(hapifyModelsJSON.models.map((m) => m.name)).to.includes(['User', 'Place']);
	});

	it('success with two boilerplates', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', [
			'--dir',
			sandbox.getPath(),
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-hapijs.git',
			'--boilerplate-url',
			'https://github.com/Tractr/boilerplate-ngx-components.git',
			'--no-presets',
			'--project-name',
			'The Name',
			'--project-desc',
			'The Description',
		]);

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 2 new dynamic boilerplates');

		// Generate code
		const response = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'60104aabe0fe50001033f10e', // User
			'--preset',
			'60104aabe0fe50001033f10f', // Place
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.be.contains(['apply 2 preset']);

		const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(['boilerplate-hapijs', 'hapify-models.json']);
		expect(hapifyModelsJSON.models.map((m) => m.name)).to.includes(['User', 'Place']);
	});

	it('already has models', async () => {
		const sandbox = new Sandbox();
		sandbox.clear();

		// Clone repository first
		const responseNew = await CLI('new', [
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

		expect(responseNew.stderr).to.be.empty();
		expect(responseNew.code).to.equal(0);
		expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

		// Generate code
		const response = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'60104aabe0fe50001033f10e', // User
			'--preset',
			'60104aabe0fe50001033f10f', // Place
		]);

		expect(response.stderr).to.be.empty();
		expect(response.code).to.equal(0);
		expect(response.stdout).to.be.contains(['apply 2 preset']);

		// Generate again
		const response2 = await CLI('import', [
			'--dir',
			sandbox.getPath(),
			'--preset',
			'60104aabe0fe50001033f10e', // User
			'--preset',
			'60104aabe0fe50001033f10f', // Place
		]);

		expect(response2.stderr).to.be.empty();
		expect(response2.code).to.equal(0);
		expect(response2.stdout).to.be.contains(['Ignore presets import', 'Operation aborted']);
	});
});
