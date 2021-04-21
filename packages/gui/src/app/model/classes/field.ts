import { IField, IFieldBase } from '../interfaces/field';
import { ILabelledValue } from '../interfaces/labelled-value';
import { FieldSubType } from './field-subtype';
import { FieldType } from './field-type';

export class Field implements IField {
  /** Constructor */
  constructor() {}

  public name = '';

  /** The field's notes */
  public notes: string;

  public type = FieldType.String;

  public subtype = FieldSubType.String.Default;

  public value = null;

  public primary = false;

  public unique = false;

  public label = false;

  public nullable = false;

  public multiple = false;

  public embedded = false;

  public searchable = false;

  public sortable = false;

  public hidden = false;

  public internal = false;

  public restricted = false;

  public ownership = false;

  public fromObject(object: IFieldBase): void {
    this.name = object.name;
    this.notes = object.notes || null;
    this.type = object.type;
    this.subtype = object.subtype;
    this.value = object.value;
    this.primary = !!(object.primary as any);
    this.unique = !!(object.unique as any);
    this.label = !!(object.label as any);
    this.nullable = !!(object.nullable as any);
    this.multiple = !!(object.multiple as any);
    this.embedded = !!(object.embedded as any);
    this.searchable = !!(object.searchable as any);
    this.sortable = !!(object.sortable as any);
    this.hidden = !!(object.hidden as any);
    this.internal = !!(object.internal as any);
    this.restricted = !!(object.restricted as any);
    this.ownership = !!(object.ownership as any);
  }

  public toObject(): IFieldBase {
    return {
      name: this.name,
      notes: this.notes || null,
      type: this.type,
      subtype: this.subtype,
      value: this.getValueProperty(),
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

  public isEmpty(): boolean {
    return typeof this.name !== 'string' || this.name.trim().length === 0;
  }

  /** Get the available sub types for the current type */
  public getAvailableSubTypes(): ILabelledValue[] {
    if (this.type === FieldType.String) {
      return FieldSubType.string();
    }
    if (this.type === FieldType.Number) {
      return FieldSubType.number();
    }
    if (this.type === FieldType.Boolean) {
      return FieldSubType.boolean();
    }
    if (this.type === FieldType.Enum) {
      return FieldSubType.enum();
    }
    if (this.type === FieldType.DateTime) {
      return FieldSubType.datetime();
    }
    if (this.type === FieldType.Entity) {
      return FieldSubType.entity();
    }
    if (this.type === FieldType.Object) {
      return FieldSubType.object();
    }
    if (this.type === FieldType.File) {
      return FieldSubType.file();
    }
    return [];
  }

  private getValueProperty(): string | string[] | null {
    if (this.type === FieldType.Entity) {
      return typeof this.value === 'string' ? this.value : null;
    }
    if (this.type === FieldType.Enum) {
      return this.value instanceof Array ? this.value : [];
    }
    return null;
  }
}
