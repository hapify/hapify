// ==================================================================
// 	 Interfaces from @hapify/generator:1.3.0
type Engine = 'hpf' | 'js' | 'ejs';
type Input = 'one' | 'all';
type FieldType =
  | 'boolean'
  | 'number'
  | 'string'
  | 'enum'
  | 'datetime'
  | 'entity'
  | 'object'
  | 'file';
type FieldSubType =
  | 'integer'
  | 'float'
  | 'latitude'
  | 'longitude'
  | 'email'
  | 'password'
  | 'url'
  | 'text'
  | 'rich'
  | 'date'
  | 'time'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'oneOne'
  | 'oneMany'
  | 'manyOne'
  | 'manyMany';

type FieldValueType<T> = T extends 'entity'
  ? string
  : T extends 'enum'
    ? string[]
    : null;
interface Field<T extends FieldType = FieldType> {
  /** The field's name */
  name: string;
  /** The field's notes */
  notes?: string;
  /** The field's type */
  type: T;
  /** The field's subtype */
  subtype: FieldSubType | null;
  /**
   * Value of the fields. Used if the type is entity or enum.
   *  - Entity: The UUID string of the targeted model
   *  - Enum: list of enum values
   */
  value: FieldValueType<T>;
  /** Should be used as a primary key or not */
  primary: boolean;
  /** Should be used as a unique key or not */
  unique: boolean;
  /** Should be used as a label or not */
  label: boolean;
  /** Denotes if the field can be empty or not */
  nullable: boolean;
  /** Denotes if the field is an array of values */
  multiple: boolean;
  /** Indicate whether the field is embedded (should be always exposed explicitly) */
  embedded: boolean;
  /** Indicate whether the field is searchable or not */
  searchable: boolean;
  /** Indicate whether the field is sortable or not */
  sortable: boolean;
  /** Indicate whether the field is hidden (should not be exposed) */
  hidden: boolean;
  /** Indicate whether the field is for an internal use only (should not be defined by an user) */
  internal: boolean;
  /** Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
  restricted: boolean;
  /** Indicate that this field defines the owner of the entity */
  ownership: boolean;
}
/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
type Access = 'admin' | 'owner' | 'auth' | 'guest';

/** Define the access for each available action */
interface Accesses {
  create: Access;
  read: Access;
  update: Access;
  remove: Access;
  search: Access;
  count: Access;
}
// ==================================================================

/** Represents the compact description of a project */
export interface IV2StorableCompactProject {
  /** The project's configuration version */
  version: '2';
  /** The project's name */
  name?: string;
  /** The project's description */
  description?: string;
  /** The project's model list */
  models: IStorableCompactModel[];
}
/** Represents the compact description of a model */
interface IStorableCompactModel {
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
interface IStorableCompactField<T extends FieldType = FieldType> {
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
type CompactFieldBooleanProperty =
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




interface IConfigTemplate {
  /** The template's path */
  path: string;
  /** The template's type */
  engine: Engine;
  /** Denotes if the template has to to be ran for one or all models */
  input: Input;
}

export interface IV2StorableCompactConfig {
  /** The channel's configuration version */
  version: '2';
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
