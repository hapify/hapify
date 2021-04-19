import { Container } from 'typedi';

import { IModel } from '../interface/Generator';
import { ISerializable, IStorable } from '../interface/Storage';
import { ModelsApiStorageService } from '../service/storage/api/Models';
import { ProjectFileStorageService } from '../service/storage/file/Project';
import { Model } from './Model';
import { Project } from './Project';

export class ModelsCollection
  implements IStorable, ISerializable<IModel[], Model[]> {
  /** The list of model instances */
  private models: Model[];

  /** The pseudo path */
  public path: string;

  /** Models storage */
  private remoteStorageService: ModelsApiStorageService;

  private localStorageService: ProjectFileStorageService;

  private constructor(private project: Project) {
    this.remoteStorageService = Container.get(ModelsApiStorageService);
    this.localStorageService = Container.get(ProjectFileStorageService);
    this.path = ModelsCollection.path(project);
  }

  /** Returns a singleton for this config */
  public static async getInstance(project: Project) {
    const path = ModelsCollection.path(project);
    const key = 'ModelsCollectionSingletons';
    const instances = Container.has(key)
      ? Container.get<ModelsCollection[]>(key)
      : [];

    // Try to find an existing collection
    const modelsCollection = instances.find((m) => m.path === path);
    if (modelsCollection) {
      return modelsCollection;
    }

    // Create and load a new collection
    const collection = new ModelsCollection(project);
    await collection.load();

    // Keep the collection
    instances.push(collection);
    Container.set(key, instances);

    return collection;
  }

  public async load(): Promise<void> {
    if (this.project.storageType === 'local') {
      this.fromObject(
        await this.localStorageService.getModels(this.project.id),
      );
    } else {
      this.fromObject(
        await this.remoteStorageService.forProject(this.project.id),
      );
    }
  }

  async save(): Promise<void> {
    if (this.project.storageType === 'local') {
      await this.localStorageService.setModels(
        this.project.id,
        this.toObject(),
      );
    } else {
      const models = await this.remoteStorageService.set(
        this.project.id,
        this.toObject(),
      );
      this.fromObject(models);
    }
  }

  /** Add one or more object to the stack */
  public async add(object: IModel | IModel[]): Promise<void> {
    if (object instanceof Array) {
      for (const o of object) {
        await this.add(o);
      }
    } else {
      this.models.push(new Model(object));
    }
  }

  /** Upsert one or more object to the stack */
  public async update(object: IModel | IModel[]): Promise<void> {
    if (object instanceof Array) {
      for (const o of object) {
        await this.update(o);
      }
    } else {
      await this.remove(object);
      await this.add(object);
    }
  }

  /** Remove an existing object */
  public async remove(object: IModel | IModel[]): Promise<void> {
    if (object instanceof Array) {
      for (const o of object) {
        await this.remove(o);
      }
    } else {
      this.models = this.models.filter((i) => i.id === object.id);
    }
  }

  /** Find a instance with its id */
  async find(id: string): Promise<Model | null> {
    return this.models.find((instance) => instance.id === id);
  }

  /** Returns the list of models */
  async list(): Promise<Model[]> {
    return this.models;
  }

  public fromObject(object: IModel[]): Model[] {
    this.models = object.map((m) => new Model(m));
    return this.models;
  }

  public toObject(): IModel[] {
    return this.models.map((m) => m.toObject());
  }

  /** Returns a pseudo path */
  private static path(project: Project): string {
    return project.storageType === 'local'
      ? project.id
      : `project:${project.id}`;
  }
}
