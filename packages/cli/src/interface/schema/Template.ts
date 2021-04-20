import Joi from 'joi';

import { Engine, Input } from '../Generator';

const TemplateInputs: Input[] = ['one', 'all'];
const TemplateEngines: Engine[] = ['hpf', 'js', 'ejs'];

export const TemplateSchema = Joi.object({
  path: Joi.string().required(),
  engine: Joi.string()
    .valid(...TemplateEngines)
    .required(),
  input: Joi.string()
    .valid(...TemplateInputs)
    .required(),
  content: Joi.string().required().allow(''),
});

export const ConfigTemplateSchema = Joi.object({
  path: Joi.string().required(),
  engine: Joi.string()
    .valid(...TemplateEngines)
    .required(),
  input: Joi.string()
    .valid(...TemplateInputs)
    .required(),
});
