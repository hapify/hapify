import { Container } from 'typedi';

import { IBoilerplate } from '../interface/Objects';
import { ISerializable, IStorable } from '../interface/Storage';
import { BoilerplatesApiStorageService } from '../service/storage/api/Boilerplates';
import { Boilerplate } from './Boilerplate';

export class BoilerplatesCollection
  implements IStorable, ISerializable<IBoilerplate[], Boilerplate[]> {
  /** The list of boilerplate instances */
  private boilerplates: Boilerplate[] = [];

  /** Boilerplates storage */
  private storageService: BoilerplatesApiStorageService;

  private constructor() {
    this.storageService = Container.get(BoilerplatesApiStorageService);
  }

  /** Returns a singleton for this config */
  public static async getInstance() {
    const key = 'BoilerplatesCollectionSingleton';
    let instance = Container.has(key)
      ? Container.get<BoilerplatesCollection>(key)
      : null;
    if (!instance) {
      // Create and load a new collection
      instance = new BoilerplatesCollection();
      await instance.load();
      Container.set(key, instance);
    }
    return instance;
  }

  /** Load the boilerplates */
  async load(): Promise<void> {
    this.fromObject(await this.storageService.list());
  }

  async save(): Promise<void> {
    // Nothing to save
  }

  /** Returns the list of boilerplates */
  async list(): Promise<Boilerplate[]> {
    return this.boilerplates;
  }

  /** Returns one boilerplate */
  async get(id: string): Promise<Boilerplate> {
    return this.boilerplates.find((p) => p.id === id);
  }

  /** Returns one boilerplate by its slug */
  async getBySlug(slug: string): Promise<Boilerplate> {
    const data = await this.storageService.list({
      _limit: 1,
      slug,
    });
    return data.length ? new Boilerplate(data[0]) : null;
  }

  public fromObject(object: IBoilerplate[]): Boilerplate[] {
    this.boilerplates = object.map((p) => new Boilerplate(p));
    return this.boilerplates;
  }

  public toObject(): IBoilerplate[] {
    return this.boilerplates.map((p) => p.toObject());
  }
}
