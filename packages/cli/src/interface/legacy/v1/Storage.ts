// =======================================================================================
// 	 Interfaces from @hapify/generator:0.5.11
type Access = 'admin' | 'owner' | 'auth' | 'guest';
interface Accesses {
  create: Access;
  read: Access;
  update: Access;
  remove: Access;
  search: Access;
  count: Access;
}
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
// =======================================================================================

/** Represents the compact description of a project */
export interface IV1StorableCompactProject {
  /** The project's configuration version */
  version: '1';
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
interface IStorableCompactField {
  /** The field's name */
  name: string;
  /** The field's type */
  type: FieldType;
  /** The field's subtype */
  subtype?: FieldSubType;
  /** The field's reference if the type is entity. The GUID string of the targeted model */
  reference?: string;
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
