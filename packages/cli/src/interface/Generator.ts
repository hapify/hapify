import {
  Access,
  Accesses,
  Engine,
  Field,
  FieldSubType,
  FieldType,
  GeneratorResult,
  Input,
  Model,
  StringVariations,
  Template,
} from '@hapify/generator/dist/Interfaces';

// Export types
export { Access, Engine, FieldSubType, FieldType, Input };

export type IStringVariants = StringVariations;
export type IGeneratorResult = GeneratorResult;
export type IAccesses = Accesses;
export interface IModel extends Model {
  /** The model's notes */
  notes?: string;
  /** The fields of the model */
  fields: IField[];
}
export interface IField extends Field {
  /** The field's notes */
  notes?: string;
}
export type ITemplate = Template;
