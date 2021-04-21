import { ILabelledValue } from '../interfaces/labelled-value';

export class FieldType {
  static Boolean = 'boolean';
  static Number = 'number';
  static String = 'string';
  static Enum = 'enum';
  static DateTime = 'datetime';
  static Entity = 'entity';
  static Object = 'object';
  static File = 'file';

  /** Get the list of available types with names */
  static list(): ILabelledValue[] {
    return [
      { name: 'String', value: FieldType.String },
      { name: 'Number', value: FieldType.Number },
      { name: 'Boolean', value: FieldType.Boolean },
      { name: 'DateTime', value: FieldType.DateTime },
      { name: 'Enum', value: FieldType.Enum },
      { name: 'Object', value: FieldType.Object },
      { name: 'File', value: FieldType.File },
      { name: 'Entity', value: FieldType.Entity },
    ];
  }
}
