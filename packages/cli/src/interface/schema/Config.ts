import Joi from 'joi';

import { FieldSchema } from './Field';
import { ModelSchema } from './Model';
import { ConfigTemplateSchema } from './Template';

const Versions = ['2'];

export const ConfigSchema = Joi.object({
  version: Joi.string()
    .valid(...Versions)
    .required(),
  validatorPath: Joi.string().required(),
  project: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string(),
  logo: Joi.string(),
  defaultFields: Joi.array().items(FieldSchema).min(0),
  templates: Joi.array().items(ConfigTemplateSchema).required().min(0),
});

export const ProjectConfigSchema = Joi.object({
  version: Joi.string()
    .valid(...Versions)
    .required(),
  name: Joi.string().required(),
  description: Joi.string(),
  models: Joi.array().items(ModelSchema).required().min(0),
});

export const GlobalConfigSchema = Joi.object({
  apiKey: Joi.string().length(48),
  apiUrl: Joi.string().min(1),
});
