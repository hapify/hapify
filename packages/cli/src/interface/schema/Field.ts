import Joi from 'joi';

const FieldTypes = [
  'boolean',
  'number',
  'string',
  'enum',
  'datetime',
  'entity',
  'object',
  'file',
];
const FieldSubTypes = [
  'integer',
  'float',
  'latitude',
  'longitude',
  'email',
  'password',
  'url',
  'text',
  'rich',
  'date',
  'time',
  'image',
  'video',
  'audio',
  'document',
  'oneOne',
  'oneMany',
  'manyOne',
  'manyMany',
];
export const FieldSchema = Joi.object({
  name: Joi.string().required(),
  notes: Joi.string().allow(null),
  type: Joi.string()
    .valid(...FieldTypes)
    .required(),
  subtype: Joi.string()
    .valid(...FieldSubTypes)
    .allow(null)
    .required(),
  value: Joi.alternatives()
    .conditional('type', {
      switch: [
        { is: 'entity', then: Joi.string() },
        { is: 'enum', then: Joi.array().items(Joi.string()) },
      ],
      otherwise: null,
    })
    .required()
    .allow(null),
  primary: Joi.boolean().required(),
  unique: Joi.boolean().required(),
  label: Joi.boolean().required(),
  nullable: Joi.boolean().required(),
  multiple: Joi.boolean().required(),
  embedded: Joi.boolean().required(),
  searchable: Joi.boolean().required(),
  sortable: Joi.boolean().required(),
  hidden: Joi.boolean().required(),
  internal: Joi.boolean().required(),
  restricted: Joi.boolean().required(),
  ownership: Joi.boolean().required(),
});
