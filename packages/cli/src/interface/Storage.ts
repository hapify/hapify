import {
  Accesses,
  FieldSubType,
  FieldType,
  FieldValueType,
} from '@hapify/generator/dist/Interfaces';

import { IConfigTemplate } from './Config';
import { IModel } from './Generator';
import { CurrentVersion } from './Version';

/** Represent a class that can be stringified and un-stringified */
export interface ISerializable<IT, T> {
  /**
   * Bind properties from the base object to this object
   *  Returns this
   */
  fromObject(object: IT): T;

  /** Convert the instance to an object */
  toObject(): IT;
}

/** Represent a class that can be loaded and saved */
export interface IStorable {
  load(): Promise<void> | void;

  save(): Promise<void> | void;
}

/** Represent a class that can be loaded and saved */
export interface IStorageService<T> {
  /** List items */
  list(query: any): Promise<T[]> | T[];
  /** List items */
  get(id: any): Promise<T> | T;
}

export type StorageType = 'local' | 'remote';

/** Represents the detailed description of a project */
export interface IStorableProject {
  /** The project's configuration version */
  version: CurrentVersion<'project'>;
  /** The project's name */
  name?: string;
  /** The project's description */
  description?: string;
  /** The project's model list */
  models: IModel[];
}
/** Represents the compact description of a project */
export interface IStorableCompactProject {
  /** The project's configuration version */
  version: CurrentVersion<'project'>;
  /** The project's name */
  name?: string;
  /** The project's description */
  description?: string;
  /** The project's model list */
  models: IStorableCompactModel[];
}
/** Represents the compact description of a model */
export interface IStorableCompactModel {
  /** The model's unique id */
  id: string;
  /** The model's name */
  name: string;
  /** The model privacy access */
  accesses: Accesses;
  /** The fields of the model */
  fields: IStorableCompactField[];
  /** The model's notes */
  notes?: string;
}
/** Represents the compact description of a model */
export interface IStorableCompactField<T extends FieldType = FieldType> {
  /** The field's name */
  name: string;
  /** The field's type */
  type: T;
  /** The field's subtype */
  subtype?: FieldSubType;
  /** The entity id, or the enum list */
  value?: FieldValueType<T>;
  /** List of boolean properties */
  properties: CompactFieldBooleanProperty[];
  /** The field's notes */
  notes?: string;
}
/** Keys of field's boolean properties */
export type CompactFieldBooleanProperty =
  | 'primary'
  | 'unique'
  | 'label'
  | 'nullable'
  | 'multiple'
  | 'embedded'
  | 'searchable'
  | 'sortable'
  | 'hidden'
  | 'internal'
  | 'restricted'
  | 'ownership';

export interface IStorableCompactConfig {
  /** The channel's configuration version */
  version: CurrentVersion<'channel'>;
  /** The channel's validation script path */
  validatorPath: string;
  /** The project id containing the models or the project file path */
  project: string;
  /** The channel's name */
  name?: string;
  /** The channel's short description */
  description?: string;
  /** The channel's logo URL */
  logo?: string;
  /** A list of model that should be added on each new model */
  defaultFields?: IStorableCompactField[];
  /** The templates of the channel */
  templates: IConfigTemplate[];
}
