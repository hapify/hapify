import Joi from 'joi';

import { AccessSchema } from './Access';
import { FieldSchema } from './Field';

export const ModelSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  notes: Joi.string().allow(null),
  meta: Joi.object().allow(null),
  fields: Joi.array().items(FieldSchema).required().min(0),
  accesses: AccessSchema,
});
