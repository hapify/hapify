import { Service } from 'typedi';
import { SingleSaveFileStorage } from './SingleSave';
import { IStorableCompactModel, IStorableCompactProject, IStorableProject } from '../../../interface/Storage';
import { IProject } from '../../../interface/Objects';
import * as Path from 'path';
import { IModel } from '../../../interface/Generator';
import { VersionService } from '../../Version';
import { VersionedObject } from '../../../interface/Version';
import { ProjectParser } from '../../parser/project/ProjectParser';
import { ConverterService } from '../../Converter';

@Service()
export class ProjectFileStorageService extends SingleSaveFileStorage<IStorableProject> {
	constructor(private versionService: VersionService, private converterService: ConverterService) {
		super();
	}
	protected async serialize(content: IStorableProject): Promise<string> {
		const compact: IStorableCompactProject = {
			version: content.version,
			name: content.name || undefined,
			description: content.description || undefined,
			models: content.models.map(
				(model): IStorableCompactModel => {
					return {
						id: model.id,
						name: model.name,
						accesses: model.accesses,
						fields: model.fields.map((f) => this.converterService.convertFieldToCompactFormat(f)),
						notes: model.notes || undefined,
					};
				}
			),
		};
		return JSON.stringify(compact, null, 2);
	}
	protected async deserialize(content: string): Promise<IStorableProject> {
		try {
			const parsedContent: VersionedObject = JSON.parse(content);
			const compact = new ProjectParser(parsedContent).convert();
			return {
				version: compact.version,
				name: compact.name,
				description: compact.description,
				models: compact.models.map((model) => {
					return {
						id: model.id,
						name: model.name,
						accesses: model.accesses,
						fields: model.fields.map((f) => this.converterService.convertFieldFromCompactFormat(f)),
						notes: model.notes || null,
					};
				}),
			};
		} catch (error) {
			throw new Error(`An error occurred while parsing Project configuration: ${error.toString()}`);
		}
	}

	async getProject(path: string): Promise<IProject> {
		const projectConfig = await this.get(path);
		return {
			id: path,
			created_at: Date.now(), // Placeholder
			description: projectConfig.description,
			name: projectConfig.name || Path.basename(Path.dirname(path)),
		};
	}

	async setProject(path: string, project: IProject, models?: IModel[]): Promise<void> {
		const projectWithModels: IStorableProject = {
			version: this.versionService.getCurrentVersion('project'),
			name: project.name,
			description: project.description,
			models: !models ? await this.getModels(path) : models,
		};
		await this.set(path, projectWithModels);
	}

	async getModels(path: string): Promise<IModel[]> {
		const project = await this.get(path);
		return project.models;
	}
	async setModels(path: string, models: IModel[]): Promise<void> {
		const project = await this.get(path);
		project.models = models;
		await this.set(path, project);
	}
}
