import { IField, IFieldBase } from './field';
import { IStorable, IStorableBase } from '@app/interfaces/storable';
import { IAccesses } from './access';

export interface IModelBase extends IStorableBase {
  /** The model's name */
  name: string;
  /** The model's notes */
  notes?: string;
  /** The fields of the model */
  fields: IFieldBase[];
  /** The model privacy access */
  accesses: IAccesses;
}

export interface IModel extends IModelBase, IStorable {
  /** The fields of the model */
  fields: IField[];

  /** Denotes if the field should be considered as empty */
  isEmpty(): boolean;

  /** Returns a new field instance */
  newField(): IField;

  /** Push a new field */
  addField(field: IField): void;

  /** Remove a field */
  removeField(field: IField): void;

  /** Push a new field */
  moveField(field: IField, indexDelta: number): void;

  /** Remove empty fields */
  filter(): void;

  /** Convert the instance to an object */
  toObject(): IModelBase;

  /** Clone the model to a new reference */
  clone(): IModel;
}
