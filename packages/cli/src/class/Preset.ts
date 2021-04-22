import { DeepRequired } from 'ts-essentials';

import { IPreset } from '../interface/Objects';
import { ISerializable } from '../interface/Storage';
import { Model } from './Model';

export class Preset implements ISerializable<IPreset, Preset>, IPreset {
  /** The preset's unique id */
  id: string;

  /** The preset icon */
  icon: string;

  /** The preset's name */
  name: string;

  /** The preset's name in french */
  name__fr: string;

  /** The preset's name */
  description: string;

  /** The preset's name in french */
  description__fr: string;

  /** The models of the model */
  models: Model[];

  constructor(object?: IPreset) {
    if (object) {
      this.fromObject(object);
    }
  }

  public fromObject(object: IPreset): Preset {
    this.id = object.id;
    this.icon = object.icon;
    this.name = object.name;
    this.name__fr = object.name__fr;
    this.description = object.description;
    this.description__fr = object.description__fr;
    this.models = object.models.map((m) => new Model(m));
    return this;
  }

  public toObject(): DeepRequired<IPreset> {
    return {
      id: this.id,
      icon: this.icon,
      name: this.name,
      name__fr: this.name__fr,
      description: this.description,
      description__fr: this.description__fr,
      models: this.models.map((m) => m.toObject()),
    };
  }
}
