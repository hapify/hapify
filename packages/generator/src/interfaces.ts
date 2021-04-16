// ==================================================================
//  Names
// ==================================================================
export interface NameInterpolable {
	/** The name of the object, as the user entered it */
	name: string;
	/** All names computed from the `name` property */
	names: StringVariations;
}
// ==================================================================
//  Fields
// ==================================================================
export type FieldType = 'boolean' | 'number' | 'string' | 'enum' | 'datetime' | 'entity' | 'object' | 'file';
export type FieldSubType =
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
	| 'document'
	| 'oneOne'
	| 'oneMany'
	| 'manyOne'
	| 'manyMany';

export type FieldValueType<T> = T extends 'entity' ? string : T extends 'enum' ? string[] : null;
export interface Field<T extends FieldType = FieldType> {
	/** The field's name */
	name: string;
	/** The field's type */
	type: T;
	/** The field's subtype */
	subtype: FieldSubType | null;
	/**
	 * Value of the fields. Used if the type is entity or enum.
	 *  - Entity: The UUID string of the targeted model
	 *  - Enum: list of enum values
	 */
	value: FieldValueType<T>;
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
	/** Indicate whether the field is hidden (should not be exposed) */
	hidden: boolean;
	/** Indicate whether the field is for an internal use only (should not be defined by an user) */
	internal: boolean;
	/** Indicate whether the field is restricted to authorized roles (should only be defined by an admin) */
	restricted: boolean;
	/** Indicate that this field defines the owner of the entity */
	ownership: boolean;
}

// ==================================================================
//  Access
// ==================================================================
/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
export type Access = 'admin' | 'owner' | 'auth' | 'guest';

/** Define the access for each available action */
export interface Accesses {
	create: Access;
	read: Access;
	update: Access;
	remove: Access;
	search: Access;
	count: Access;
}
/** Possible actions */
export type Action = keyof Accesses;

export interface Model {
	/** The model's unique id */
	id: string;
	/** The model's name */
	name: string;
	/** The fields of the model */
	fields: Field[];
	/** The model privacy access */
	accesses: Accesses;
}
export type Engine = 'hpf' | 'js' | 'ejs';
export type Input = 'one' | 'all';
export interface Template {
	/** The template's path */
	path: string;
	/** The template's type */
	engine: Engine;
	/** Denotes if the template has to to be ran for one or all models */
	input: Input;
	/** The template's content */
	content: string;
}

// ==================================================================
//  Explicit model
// ==================================================================
export interface AliasedArray<T> extends Array<T> {
	/** Alias of `filter` */
	f(callback: (value: T, index: number, array: T[]) => value is T, thisArg?: any): T[];
}
interface BaseExplicitModel extends NameInterpolable {
	/** An unique id */
	id: string;
	/** An object containing pre-computed properties from fields */
	properties: ExplicitDeepModelProperties;
	/** Alias of `p` */
	p: ExplicitDeepModelProperties;
	/** An object containing all action's accesses grouped by action or restriction */
	accesses: ExplicitModelAccesses;
	/** Alias of `accesses` */
	a: ExplicitModelAccesses;
}
export interface ExplicitModel extends BaseExplicitModel {
	/** An object containing all fields, grouped in different arrays */
	fields: ExplicitModelFields;
	/** Alias of `fields` */
	f: ExplicitModelFields;
	/** An object containing pre-computed properties from fields */
	properties: ExplicitModelProperties;
	/** Alias of `p` */
	p: ExplicitModelProperties;
	/**  Non-deep model only. An object containing dependencies (to other models) of this model. A model has a dependency if one of this field is of type `entity` */
	dependencies: ExplicitModelDependencies;
	/** Alias of `dependencies` */
	d: ExplicitModelDependencies;
	/** Non-deep model only. An array containing models that refer to this one. These models are added as "deep models" */
	referencedIn: AliasedArray<ExplicitReferenceModel>;
	/** Alias of `referencedIn` */
	ri: AliasedArray<ExplicitReferenceModel>;
}
export interface ExplicitDeepModel extends BaseExplicitModel {
	/** An object containing all fields, grouped in different arrays */
	fields: ExplicitDeepModelFields;
	/** Alias of `fields` */
	f: ExplicitDeepModelFields;
}
export interface ExplicitReferenceModel extends BaseExplicitModel {
	/** An array containing fields referencing the parent the model */
	fields: AliasedArray<ExplicitField>;
	/** Alias of `fields` */
	f: AliasedArray<ExplicitField>;
}
export interface ExplicitEnum extends NameInterpolable {}
export interface ExplicitField<T extends FieldType = FieldType> extends Field<T>, NameInterpolable {}
export interface ExplicitReferenceField extends ExplicitField<'entity'> {
	/** The target model object if the field is of type `entity` */
	model: ExplicitDeepModel;
	/** Alias of `model` */
	m: ExplicitDeepModel;
}
export interface ExplicitEnumField extends ExplicitField<'enum'> {
	/** The list of string variations for the enum */
	enum: AliasedArray<ExplicitEnum>;
	/** Alias of `enum` */
	e: AliasedArray<ExplicitEnum>;
}
export interface ExplicitDeepModelFields {
	/** An array containing all fields of the model */
	list: ExplicitField[];
	/** Alias of `list` */
	l: ExplicitField[];
	/** The primary field of the model. `null` if no primary field is defined. */
	primary: ExplicitField | undefined;
	/** Alias of `primary` */
	pr: ExplicitField | undefined;
	/** An array containing all fields flagged as `unique` */
	unique: ExplicitField[];
	/** Alias of `unique` */
	un: ExplicitField[];
	/** An array containing all fields flagged as `label` */
	label: ExplicitField[];
	/** Alias of `label` */
	lb: ExplicitField[];
	/** An array containing all fields flagged as `nullable` */
	nullable: ExplicitField[];
	/** Alias of `nullable` */
	nu: ExplicitField[];
	/** An array containing all fields flagged as `multiple` */
	multiple: ExplicitField[];
	/** Alias of `multiple` */
	ml: ExplicitField[];
	/** An array containing all fields flagged as `embedded` */
	embedded: ExplicitField[];
	/** Alias of `embedded` */
	em: ExplicitField[];
	/** An array containing all fields flagged as `searchable` */
	searchable: ExplicitField[];
	/** Alias of `searchable` */
	se: ExplicitField[];
	/** An array containing all fields flagged as `sortable` */
	sortable: ExplicitField[];
	/** Alias of `sortable` */
	so: ExplicitField[];
	/** An array containing all fields flagged as `hidden` */
	hidden: ExplicitField[];
	/** Alias of `hidden` */
	hd: ExplicitField[];
	/** An array containing all fields flagged as `internal` */
	internal: ExplicitField[];
	/** Alias of `internal` */
	in: ExplicitField[];
	/** An array containing all fields flagged as `restricted` */
	restricted: ExplicitField[];
	/** Alias of `restricted` */
	rs: ExplicitField[];
	/** An array containing all fields flagged as `ownership` */
	ownership: ExplicitField[];
	/** Alias of `ownership` */
	os: ExplicitField[];
	/** An array containing all fields flagged as `label` and `searchable`. Useful for quick-search by label. */
	searchableLabel: ExplicitField[];
	/** Alias of `searchableLabel` */
	sl: ExplicitField[];
	/** A function for filtering fields with a custom rule. Equivalent of `model.fields.list.filter` */
	filter: ExplicitFieldsFilterFunction;
	/** Alias of `filter` */
	f: ExplicitFieldsFilterFunction;
}
export interface ExplicitModelFields extends ExplicitDeepModelFields {
	/** Non-deep model only. An array containing all fields of type `entity`. */
	references: AliasedArray<ExplicitReferenceField>;
	/** Alias of `references` */
	r: AliasedArray<ExplicitReferenceField>;
}
export type ExplicitFieldsFilterFunction = (callback: ((value: ExplicitField, index: number, array: ExplicitField[]) => boolean) | null) => ExplicitField[];
export interface ExplicitModelDependencies {
	/** An array containing all dependency models, but self. These models are added as "deep models" */
	list: ExplicitDeepModel[];
	/** Alias of `list` */
	l: ExplicitDeepModel[];
	/** A boolean indicating if this model has a self-dependency */
	self: boolean;
	/** Alias of `self` */
	s: boolean;
	/** A function to filter dependencies */
	filter: ExplicitModelDependenciesFilter;
	/** Alias of `filter` */
	f: ExplicitModelDependenciesFilter;
}
/**
 * First argument (function - default `(f) => !!f`): The filtering function receiving the referencer field (the entity field)
 * Second argument (boolean - default `true`): A boolean indicating if we should exclude the self dependency.
 */
export type ExplicitModelDependenciesFilter = (filter?: (field: ExplicitField) => boolean, excludeSelf?: boolean) => ExplicitDeepModel[];
export interface ExplicitDeepModelProperties {
	/** The number of fields contained in the model */
	fieldsCount: number;
	/** Denotes if the model has a primary field */
	hasPrimary: boolean;
	/** Denotes if the model has at least one unique field */
	hasUnique: boolean;
	/** Denotes if the model has at least one label field */
	hasLabel: boolean;
	/** Denotes if the model has at least one nullable field */
	hasNullable: boolean;
	/** Denotes if the model has at least one multiple field */
	hasMultiple: boolean;
	/** Denotes if the model has at least one embedded field */
	hasEmbedded: boolean;
	/** Denotes if the model has at least one searchable field */
	hasSearchable: boolean;
	/** Denotes if the model has at least one sortable field */
	hasSortable: boolean;
	/** Denotes if the model has at least one hidden field */
	hasHidden: boolean;
	/** Denotes if the model has at least one internal field */
	hasInternal: boolean;
	/** Denotes if the model has at least one restricted field */
	hasRestricted: boolean;
	/** Denotes if the model has at least one ownership field */
	hasOwnership: boolean;
	/** Denotes if the model has at least one field marked as label and also searchable */
	hasSearchableLabel: boolean;
	/** Denotes if most of the fields are hidden (strictly) */
	mainlyHidden: boolean;
	/** Denotes if most of the fields are internal (strictly) */
	mainlyInternal: boolean;
	/** Denotes if the model contains at least one latitude field and one longitude field */
	isGeolocated: boolean;
	/** Denotes if the model contains at least one searchable latitude field and one searchable longitude field */
	isGeoSearchable: boolean;
}
export interface ExplicitModelProperties extends ExplicitDeepModelProperties {
	/** Denotes if the model has dependencies to other models or itself (through an `entity` field) */
	hasDependencies: boolean;
	/** Denotes if the model is referenced by other models */
	isReferenced: boolean;
}
export interface ExplicitAccesses {
	/** The name of the action */
	action: Action;
	/** Indicates if the selected access is `admin` */
	admin: boolean;
	/** Indicates if the selected access is `owner` */
	owner: boolean;
	/** Indicates if the selected access is `authenticated` */
	auth: boolean;
	/** Indicates if the selected access is `guest` */
	guest: boolean;
	/** Denotes if the selected access is greater or equal than `admin` (should always be `true`) */
	gteAdmin: boolean;
	/** Denotes if the selected access is greater or equal than `owner` */
	gteOwner: boolean;
	/** Denotes if the selected access is greater or equal than `authenticated` */
	gteAuth: boolean;
	/** Denotes if the selected access is greater or equal than `guest` */
	gteGuest: boolean;
	/** Denotes if the selected access is less or equal than `admin` */
	lteAdmin: boolean;
	/** Denotes if the selected access is less or equal than `owner` */
	lteOwner: boolean;
	/** Denotes if the selected access is less or equal than `authenticated` */
	lteAuth: boolean;
	/** Denotes if the selected access is less or equal than `guest` (should always be `true`) */
	lteGuest: boolean;
}
export interface ExplicitModelAccessProperties {
	/** Denotes if the model only contains actions restricted to `admin` */
	onlyAdmin: boolean;
	/** Denotes if the model only contains actions restricted to `owner` */
	onlyOwner: boolean;
	/** Denotes if the model only contains actions restricted to `authenticated` */
	onlyAuth: boolean;
	/** Denotes if the model only contains actions restricted to `guest` */
	onlyGuest: boolean;
	/** Denotes if the most permissive access is `admin` */
	maxAdmin: boolean;
	/** Denotes if the most permissive access is `owner` */
	maxOwner: boolean;
	/** Denotes if the most permissive access is `authenticated` */
	maxAuth: boolean;
	/** Denotes if the most permissive access is `guest` */
	maxGuest: boolean;
	/** Denotes if there is no action restricted to `admin` */
	noAdmin: boolean;
	/** Denotes if there is no action restricted to `owner` */
	noOwner: boolean;
	/** Denotes if there is no action restricted to `authenticated` */
	noAuth: boolean;
	/** Denotes if there is no action restricted to `guest` */
	noGuest: boolean;
	/** Denotes if there is at least one action restricted to `admin` */
	hasAdmin: boolean;
	/** Denotes if there is at least one action restricted to `owner` */
	hasOwner: boolean;
	/** Denotes if there is at least one action restricted to `authenticated` */
	hasAuth: boolean;
	/** Denotes if there is at least one action restricted to `guest` */
	hasGuest: boolean;
}
export type ExplicitModelAccessFilter = (func: (a: ExplicitAccesses) => boolean | null) => ExplicitAccesses[];
export interface ExplicitModelAccesses {
	/** An array containing all action's accesses of the model. */
	list: ExplicitAccesses[];
	/** Alias of `list` */
	l: ExplicitAccesses[];
	/** A function for filtering action's accesses with a custom rule. Equivalent of `model.accesses.list.filter`. */
	filter: ExplicitModelAccessFilter;
	/** Alias of `filter` */
	f: ExplicitModelAccessFilter;
	/** An object containing pre-computed properties from action's accesses. */
	properties: ExplicitModelAccessProperties;
	/** Alias of `properties` */
	p: ExplicitModelAccessProperties;
	/** An array containing all action's accesses restricted to `admin`. */
	admin: ExplicitAccesses[];
	/** Alias of `admin` */
	ad: ExplicitAccesses[];
	/** An array containing all action's accesses restricted to `owner`. */
	owner: ExplicitAccesses[];
	/** Alias of `owner` */
	ow: ExplicitAccesses[];
	/** An array containing all action's accesses restricted to `authenticated`. */
	auth: ExplicitAccesses[];
	/** Alias of `auth` */
	au: ExplicitAccesses[];
	/** An array containing all action's accesses restricted to `guest`. */
	guest: ExplicitAccesses[];
	/** Alias of `guest` */
	gs: ExplicitAccesses[];
	/** An object containing the `create` action's access. */
	create: ExplicitAccesses;
	/** Alias of `create` */
	c: ExplicitAccesses;
	/** An object containing the `read` action's access. */
	read: ExplicitAccesses;
	/** Alias of `read` */
	r: ExplicitAccesses;
	/** An object containing the `update` action's access. */
	update: ExplicitAccesses;
	/** Alias of `update` */
	u: ExplicitAccesses;
	/** An object containing the `delete` action's access. */
	remove: ExplicitAccesses;
	/** Alias of `remove` */
	d: ExplicitAccesses;
	/** An object containing the `search` action's access. */
	search: ExplicitAccesses;
	/** Alias of `search` */
	s: ExplicitAccesses;
	/** An object containing the `count` action's access. */
	count: ExplicitAccesses;
	/** Alias of `count` */
	n: ExplicitAccesses;
}

// ==================================================================
//  Strings
// ==================================================================
export interface StringVariations {
	/** The string of the field, as the user entered it. Example `fiRst Name`. */
	raw: string;
	/** The string with hyphens and lower case. Example `first-name`. */
	kebab: string;
	/** The string with underscores and lower case. Example `first_name`. */
	snake: string;
	/** The string with hyphens and first letters capitalized. Example `First-Name`. */
	header: string;
	/**  The string with underscores and upper case. Example `FIRST_NAME`. */
	constant: string;
	/** The string with hyphens and upper case. Example `FIRST-NAME`. */
	big: string;
	/** The string as words with upper case on first letters. Example `First Name`. */
	capital: string;
	/** The string as words in lower case. Example `first name`. */
	lower: string;
	/** The string as words in upper case. Example `FIRST NAME`. */
	upper: string;
	/** The string joined and lower case. Example `firstname`. */
	compact: string;
	/** The string as upper camel case. Example `FirstName`. */
	pascal: string;
	/** The string as lower camel case. Example `firstName`. */
	camel: string;
}
export type StringVariationType = keyof StringVariations;

// ==================================================================
//  Generator
// ==================================================================
export interface GeneratorWorker {
	/** Run generation process for one model */
	one(model: ExplicitModel, template: Template): Promise<string>;
	/** Run generation process for all models */
	all(models: ExplicitModel[], template: Template): Promise<string>;
}
export interface GeneratorResult {
	/** The file path */
	path: string;
	/** The file content */
	content: string;
}
export type SingleModelGenerationContext = {
	m: ExplicitModel;
	model: ExplicitModel;
};
export type MultipleModelsGenerationContext = {
	m: ExplicitModel[];
	models: ExplicitModel[];
};
export type GenerationContext = SingleModelGenerationContext | MultipleModelsGenerationContext;

// ==================================================================
//  Errors
// ==================================================================
export interface NumberedError extends Error {
	code: number;
}
