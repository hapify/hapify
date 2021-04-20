import Joi from 'joi';

import { Access } from '../Generator';

const AccessValues: Access[] = ['admin', 'owner', 'auth', 'guest'];

export const AccessSchema = Joi.object({
  create: Joi.string()
    .valid(...AccessValues)
    .required(),
  read: Joi.string()
    .valid(...AccessValues)
    .required(),
  update: Joi.string()
    .valid(...AccessValues)
    .required(),
  remove: Joi.string()
    .valid(...AccessValues)
    .required(),
  search: Joi.string()
    .valid(...AccessValues)
    .required(),
  count: Joi.string()
    .valid(...AccessValues)
    .required(),
});
