import { Container } from 'typedi';

import { IPreset } from '../interface/Objects';
import { ISerializable, IStorable } from '../interface/Storage';
import { PresetsApiStorageService } from '../service/storage/api/Presets';
import { Preset } from './Preset';

export class PresetsCollection
  implements IStorable, ISerializable<IPreset[], Preset[]> {
  get storageService(): PresetsApiStorageService {
    return this.storageServiceInstance;
  }

  set storageService(value: PresetsApiStorageService) {
    this.storageServiceInstance = value;
  }

  /** The list of preset instances */
  private presets: Preset[] = [];

  /** Presets storage */
  private storageServiceInstance: PresetsApiStorageService;

  private constructor() {
    this.storageServiceInstance = Container.get(PresetsApiStorageService);
  }

  /** Returns a singleton for this config */
  public static async getInstance() {
    const key = 'PresetsCollectionSingleton';
    let instance = Container.has(key)
      ? Container.get<PresetsCollection>(key)
      : null;
    if (!instance) {
      // Create and load a new collection
      instance = new PresetsCollection();
      await instance.load();
      Container.set(key, instance);
    }
    return instance;
  }

  /** Load the presets */
  async load(): Promise<void> {
    this.fromObject(await this.storageServiceInstance.list());
  }

  async save(): Promise<void> {
    // Nothing to save
  }

  /** Returns the list of presets */
  list(): Preset[] {
    return this.presets;
  }

  /** Returns one preset */
  get(id: string): Preset {
    return this.presets.find((p) => p.id === id);
  }

  public fromObject(object: IPreset[]): Preset[] {
    this.presets = object.map((p) => new Preset(p));
    return this.presets;
  }

  public toObject(): IPreset[] {
    return this.presets.map((p) => p.toObject());
  }
}
