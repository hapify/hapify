import { CurrentVersion } from './Version';

// =======================================================================================
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
  | 'enum'
  | 'datetime'
  | 'entity'
  | 'object'
  | 'file';
export type FieldSubType =
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
type FieldBooleanProperty =
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
// =======================================================================================

export interface IApiModel {
  _id: string;
  created_at: number;
  updated_at?: number | null;
  version: CurrentVersion<'model'>;
  owner?: string;
  project?: string;
  name: string;
  notes?: string;
  meta?: Record<string, string>;
  fields: Field[];
  accesses: Accesses;
}

interface Field {
  name: string;
  notes?: string | null;
  meta?: Record<string, string> | null;
  type: FieldType;
  subtype?: FieldSubType | null;
  properties: FieldBooleanProperty[];
  value?: string | string[] | null;
}
interface Accesses {
  create: Access;
  read: Access;
  update: Access;
  remove: Access;
  search: Access;
  count: Access;
}

export interface IApiPreset {
  _id: string;
  models: IApiModel[];
  name: string;
  name__fr?: string | null;
  slug: string;
  icon: string;
  description: string;
  description__fr?: string | null;
  created_at: number;
  version: CurrentVersion<'preset'>;
}
