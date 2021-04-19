// =======================================================================================
// 	 Interfaces from @hapify/generator:0.5.11
type Engine = 'hpf' | 'js';
type Input = 'one' | 'all';
type FieldType =
  | 'boolean'
  | 'number'
  | 'string'
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
  | 'document';

interface Field {
  /** The field's name */
  name: string;
  /** The field's type */
  type: FieldType;
  /** The field's subtype */
  subtype: FieldSubType | null;
  /** The field's reference if the type is entity. The GUID string of the targeted model */
  reference: string | null;
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
// =======================================================================================

interface IField extends Field {
  /** The field's notes */
  notes?: string;
}
export interface IV1Config {
  /** The channel's configuration version */
  version: '1';
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
  defaultFields?: IField[];
  /** The templates of the channel */
  templates: IConfigTemplate[];
}
interface IConfigTemplate {
  /** The template's path */
  path: string;
  /** The template's type */
  engine: Engine;
  /** Denotes if the template has to to be ran for one or all models */
  input: Input;
}
