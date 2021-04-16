import { Command } from 'commander';
import * as Inquirer from 'inquirer';
import { Container } from 'typedi';
import { ProjectsService } from '../../service/Projects';

export interface ProjectQuery {
	id?: string;
	name?: string;
	description?: string;
}

export async function AskLocalProject(cmd: Command, qProject: ProjectQuery) {
	if (cmd.projectName) {
		qProject.name = cmd.projectName;
		qProject.description = cmd.projectDesc;
	} else {
		const answer: any = await Inquirer.prompt([
			{
				name: 'name',
				message: 'Enter a project name',
				validate: (input: any) => input.length > 0,
			},
			{
				name: 'description',
				message: 'Enter a project description',
			},
		]);
		qProject.name = answer.name;
		qProject.description = answer.description;
	}
}

export async function AskRemoteProject(cmd: Command, qProject: ProjectQuery) {
	const projectsCollection = await Container.get(ProjectsService).collection();

	if (cmd.project) {
		qProject.id = cmd.project;
	} else if (cmd.projectName) {
		qProject.name = cmd.projectName;
		qProject.description = cmd.projectDesc;
	} else {
		// Get projects from remote
		const list = (await projectsCollection.list()).map((b: any) => ({
			name: b.name,
			value: b.id,
		}));
		const answer: any = await Inquirer.prompt([
			{
				name: 'id',
				message: 'Choose a project',
				type: 'list',
				choices: [{ name: 'Create a new project', value: null }, new Inquirer.Separator(), ...list],
				when: () => list.length > 0,
			},
			{
				name: 'name',
				message: 'Enter a project name',
				when: (answer: any) => !answer.id,
				validate: (input: any) => input.length > 0,
			},
			{
				name: 'description',
				message: 'Enter a project description',
				when: (answer: any) => !answer.id,
			},
		]);
		qProject.id = answer.id;
		qProject.name = answer.name;
		qProject.description = answer.description;
	}

	if (!qProject.id && !qProject.name) {
		throw new Error('No project is defined');
	}
}
export async function SetupRemoteProject(qProject: ProjectQuery) {
	const projectsCollection = await Container.get(ProjectsService).collection();

	if (!qProject.id) {
		const project = await projectsCollection.add(qProject.name, qProject.description);
		qProject.id = project.id;
	}
}
