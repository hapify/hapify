import { IModel, ITemplate } from './Generator';

export interface IChannel {
	/** The channel's unique id */
	id: string;
	/** The channel's name */
	name: string;
	/** The channel's short description */
	description: string;
	/** The channel's logo URL */
	logo: string;
	/** The templates of the channel */
	templates: ITemplate[];
	/** The channel's validation script */
	validator: string;
}

export interface IPreset {
	/** The preset's unique id */
	id: string;
	/** The preset icon */
	icon: string;
	/** The preset's name */
	name: string;
	/** The preset's name in french */
	name__fr: string;
	/** The preset's name */
	description: string;
	/** The preset's name in french */
	description__fr: string;
	/** The models of the preset */
	models: IModel[];
}

export interface IBoilerplate {
	/** The boilerplate's unique id */
	id: string;
	/** The boilerplate sluh */
	slug: string;
	/** The boilerplate's name */
	name: string;
	/** The boilerplate's repository url */
	git_url: string;
}

export interface IProject {
	/** The project's unique id */
	id: string;
	/** The project's creation date */
	created_at?: number;
	/** The project's name */
	name: string;
	/** The project's description */
	description?: string | null;
}
