import {
  Access,
  Accesses,
  Engine,
  FieldSubType,
  FieldType,
  GeneratorResult,
  Field as IField,
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
  /** The fields of the model */
  fields: IField[];
}
export { IField };
export type ITemplate = Template;
