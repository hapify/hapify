import { IChannel } from './channel';

export interface ITemplateBase {
	/** The template's path */
	path: string;
	/** The template's type */
	engine: string;
	/** Denotes if the template has to to be ran for one or all models */
	input: string;
	/** The template's content */
	content: string;
}

export interface ITemplate extends ITemplateBase {
	/** Stores the extension of the output file */
	type: string | null;
	/** Convert the instance to an object */
	toObject(): ITemplateBase;

	/** Bind properties from the base object to this object */
	fromObject(object: ITemplateBase): void;

	/** Create a clone of this template */
	clone(): ITemplate;

	/** Get the extension of the input file */
	extension(): string;

	/** Get the Ace Editor's mode of the input file */
	aceMode(): string;

	/** Denotes if the template should be considered as empty */
	isEmpty(): boolean;

	/** Denotes if the template needs a specific model to be generated */
	needsModel(): boolean;

	/** Returns the containing channel */
	channel(): IChannel;

	/** Returns the sub parts of the path */
	splitPath(): string[];
}
