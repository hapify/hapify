import { IAccesses, IModel } from '../interface/Generator';
import { ISerializable } from '../interface/Storage';
import { Field } from './Field';

function p8(s?: boolean) {
  const p = (`${Math.random().toString(16)  }000000000`).substr(2, 8);
  return s ? `-${  p.substr(0, 4)  }-${  p.substr(4, 4)}` : p;
}

export class Model implements ISerializable<IModel, Model>, IModel {
  /** The model's unique id */
  id: string;

  /** The model's name */
  name: string;

  /** The model's notes */
  notes?: string;

  /** The fields of the model */
  fields: Field[];

  /** The model privacy access */
  accesses: IAccesses;

  constructor(object?: IModel) {
    if (object) {
      this.fromObject(object);
    }
  }

  public fromObject(object: IModel): Model {
    this.id = object.id;
    this.name = object.name;
    this.notes = object.notes || null;
    this.fields = object.fields.map((f) => new Field(f));
    this.accesses = object.accesses;
    return this;
  }

  public toObject(): IModel {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes || null,
      fields: this.fields.map((f) => f.toObject()),
      accesses: this.accesses,
    };
  }

  /**
   * Randomly generate id
   *
   */
  static generateTempId(): string {
    return p8() + p8(true) + p8(true) + p8();
  }

  /** Get default accesses */
  static defaultAccesses(): IAccesses {
    return {
      create: 'guest',
      read: 'guest',
      update: 'guest',
      remove: 'guest',
      search: 'guest',
      count: 'guest',
    };
  }

  /** Clone the model to a new reference */
  public clone(newId: boolean): Model {
    const object = this.toObject();
    if (newId) {
      object.id = Model.generateTempId();
    }
    return new Model(object);
  }
}
