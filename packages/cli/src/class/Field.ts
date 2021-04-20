import { FieldSubType, FieldType, IField } from '../interface/Generator';
import { ISerializable } from '../interface/Storage';

export class Field implements ISerializable<IField, Field> {
  /** The field's name */
  name: string;

  /** The field's notes */
  notes?: string;

  /** The field's type */
  type: FieldType;

  /** The field's subtype */
  subtype: FieldSubType | null;

  /** The entity id, or the enum list */
  value: string | string[];

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

  /** Indicate whether the field is private (should not be exposed) */
  hidden: boolean;

  /** Indicate whether the field is for an internal use only (should not be defined by an user) */
  internal: boolean;

  /** Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
  restricted: boolean;

  /** Indicate that this field defines the owner of the entity */
  ownership: boolean;

  constructor(object?: IField) {
    if (object) {
      this.fromObject(object);
    }
  }

  public fromObject(object: IField): Field {
    this.name = object.name;
    this.notes = object.notes || null;
    this.type = object.type;
    this.subtype = object.subtype;
    this.value = object.value;
    this.primary = !!(<any>object.primary);
    this.unique = !!(<any>object.unique);
    this.label = !!(<any>object.label);
    this.nullable = !!(<any>object.nullable);
    this.multiple = !!(<any>object.multiple);
    this.embedded = !!(<any>object.embedded);
    this.searchable = !!(<any>object.searchable);
    this.sortable = !!(<any>object.sortable);
    this.hidden = !!(<any>object.hidden);
    this.internal = !!(<any>object.internal);
    this.restricted = !!(<any>object.restricted);
    this.ownership = !!(<any>object.ownership);
    return this;
  }

  public toObject(): IField {
    return {
      name: this.name,
      notes: this.notes || null,
      type: this.type,
      subtype: this.subtype,
      value: this.type === 'entity' || this.type === 'enum' ? this.value : null,
      primary: this.primary,
      unique: this.unique,
      label: this.label,
      nullable: this.nullable,
      multiple: this.multiple,
      embedded: this.embedded,
      searchable: this.searchable,
      sortable: this.sortable,
      hidden: this.hidden,
      internal: this.internal,
      restricted: this.restricted,
      ownership: this.ownership,
    };
  }
}
