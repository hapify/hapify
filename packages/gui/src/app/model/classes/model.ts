import { IAccesses } from '../interfaces/access';
import { IField, IFieldBase } from '../interfaces/field';
import { IModel, IModelBase } from '../interfaces/model';
import { Field } from './field';

export class Model implements IModel {
  /**
   * Constructor
   * Auto-generate unique id
   */
  constructor() {}

  public id: string;

  public name = '';

  public notes: string;

  public fields: IField[] = [];

  public accesses: IAccesses;

  public newField(): IField {
    return new Field();
  }

  public addField(field: IField): void {
    this.fields.push(field);
  }

  public removeField(field: IField): void {
    this.fields = this.fields.filter((f: IField) => f !== field);
  }

  public moveField(field: IField, indexDelta: number): void {
    const index = this.fields.indexOf(field);
    const newIndex = Math.max(
      0,
      Math.min(this.fields.length, index + indexDelta),
    );
    this.fields.splice(newIndex, 0, this.fields.splice(index, 1)[0]);
  }

  public fromObject(object: IModelBase): void {
    this.id = object.id;
    this.name = object.name;
    this.notes = object.notes || null;
    this.fields = object.fields.map(
      (fieldBase: IFieldBase): IField => {
        const field = this.newField();
        field.fromObject(fieldBase);
        return field;
      },
    );
    this.accesses = object.accesses;
  }

  public toObject(): IModelBase {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes || null,
      fields: this.fields
        .filter((field: IField): boolean => !field.isEmpty())
        .map((field: IField): IFieldBase => field.toObject()),
      accesses: this.accesses,
    };
  }

  public isEmpty(): boolean {
    const nameIsEmpty = typeof this.name !== 'string' || this.name.length === 0;
    const fieldsAreEmpty = this.fields.every((field: IField): boolean =>
      field.isEmpty(),
    );

    return nameIsEmpty || fieldsAreEmpty;
  }

  public filter(): void {
    this.fields = this.fields.filter((field: IField): boolean => !field.isEmpty());
  }

  public clone(): IModel {
    const model = new Model();
    model.fromObject(this.toObject());
    return model;
  }
}
