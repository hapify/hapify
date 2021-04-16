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
} from '@hapify/generator/dist/interfaces';

// Export types
export { Access, Engine, FieldSubType, FieldType, Input };

export interface IStringVariants extends StringVariations {}
export interface IGeneratorResult extends GeneratorResult {}
export interface IAccesses extends Accesses {}
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
export interface ITemplate extends Template {}
