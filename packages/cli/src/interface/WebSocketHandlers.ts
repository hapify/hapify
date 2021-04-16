import { IProject } from './Objects';
import { ILimits } from './Config';
import { IModel, ITemplate } from './Generator';

export interface WebSocketApplyPresetHandlerInput {
	models: IModel[];
}
export interface WebSocketApplyPresetHandlerOutput {
	updated: IModel[];
	created: IModel[];
}

export interface WebSocketGenerateChannelHandlerInput {
	channel: string;
}

export interface WebSocketGenerateTemplateHandlerInput {
	channel: string;
	template: string;
}

export interface WebSocketGetInfoHandlerOutput {
	project: IProject;
	limits: ILimits;
}

export interface WebSocketNewModelHandlerInput {
	name: string;
}

export interface WebSocketPathPreviewHandlerInput {
	model?: string;
	path: string;
}

export interface WebSocketTemplatePreviewHandlerInput {
	model?: string;
	channel: string;
	template: ITemplate;
}

export interface WebSocketValidateModelHandlerInput {
	model: IModel;
	content: string;
}
