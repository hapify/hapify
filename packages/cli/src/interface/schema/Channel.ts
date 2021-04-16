import Joi from 'joi';
import { TemplateSchema } from './Template';

export const ChannelSchema = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().required(),
	description: Joi.string().required().allow(null),
	logo: Joi.string().required().allow(null),
	validator: Joi.string().required().allow(''),
	templates: Joi.array().items(TemplateSchema).required(),
});
