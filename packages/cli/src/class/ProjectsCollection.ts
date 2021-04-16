import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { IProject } from '../interface/Objects';
import { Project } from './Project';
import { ProjectsApiStorageService } from '../service/storage/api/Projects';

export class ProjectsCollection implements IStorable, ISerializable<IProject[], Project[]> {
	/** The list of project instances */
	private projects: Project[] = [];
	/** Projects storage */
	private storageService: ProjectsApiStorageService;

	private constructor() {
		this.storageService = Container.get(ProjectsApiStorageService);
	}

	/** Returns a singleton for this config */
	public static async getInstance() {
		const key = 'ProjectsCollectionSingleton';
		let instance = Container.has(key) ? Container.get<ProjectsCollection>(key) : null;
		if (!instance) {
			// Create and load a new collection
			instance = new ProjectsCollection();
			await instance.load();
			Container.set(key, instance);
		}
		return instance;
	}

	/** Load the projects */
	async load(): Promise<void> {
		this.fromObject(await this.storageService.list());
	}

	async save(): Promise<void> {
		for (const project of this.projects) {
			await project.save();
		}
	}

	/** Returns the list of projects */
	async list(): Promise<Project[]> {
		return this.projects;
	}

	/** Returns one project */
	async get(id: string): Promise<Project> {
		return this.projects.find((p) => p.id === id);
	}

	/** Create new project */
	async add(name: string, description: string): Promise<Project> {
		const object = await this.storageService.create({
			name,
			description: description.length ? description : null,
		});
		return new Project(object);
	}

	public fromObject(object: IProject[]): Project[] {
		this.projects = object.map((p) => new Project(p));
		return this.projects;
	}

	public toObject(): IProject[] {
		return this.projects.map((p) => p.toObject());
	}
}
