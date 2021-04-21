import { ILabelledValue } from './labelled-value';

export interface IFieldBase {
  /** The field's name */
  name: string;
  /** The field's notes */
  notes?: string;
  /** The field's type */
  type: string;
  /** The field's subtype */
  subtype: string | null;
  /**
   * Value of the fields. Used if the type is entity or enum.
   *  - Entity: The UUID string of the targeted model
   *  - Enum: list of enum values
   */
  value: string | string[] | null;
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
}

export interface IField extends IFieldBase {
  /** Convert the instance to an object */
  toObject(): IFieldBase;

  /** Bind properties from the base object to this object */
  fromObject(object: IFieldBase): void;

  /** Denotes if the field should be considered as empty */
  isEmpty(): boolean;

  /** Get the available subtypes corresponding to the type */
  getAvailableSubTypes(): ILabelledValue[];
}
