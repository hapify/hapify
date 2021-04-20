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

export interface IV1ApiModel {
  _id: string;
  created_at: number;
  updated_at?: number | null;
  version: '1';
  owner?: string;
  project?: string;
  name: string;
  notes?: string;
  fields: Field[];
  accesses: Accesses;
}

interface Field {
  name: string;
  notes?: string | null;
  type: FieldType;
  subtype?: FieldSubType | null;
  reference?: string | null;
  primary: boolean;
  unique: boolean;
  label: boolean;
  nullable: boolean;
  multiple: boolean;
  embedded: boolean;
  searchable: boolean;
  sortable: boolean;
  hidden: boolean;
  internal: boolean;
  restricted: boolean;
  ownership: boolean;
}
interface Accesses {
  create: Access;
  read: Access;
  update: Access;
  remove: Access;
  search: Access;
  count: Access;
}

export interface IV1ApiPreset {
  _id: string;
  models: IV1ApiModel[];
  name: string;
  name__fr?: string | null;
  slug: string;
  icon: string;
  description: string;
  description__fr?: string | null;
  created_at: number;
  version: '1';
}
