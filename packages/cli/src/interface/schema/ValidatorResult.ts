import Joi, { ValidationError } from 'joi';

export const ValidatorResultSchema = Joi.object({
  errors: Joi.array().items(Joi.string()).required().min(0),
  warnings: Joi.array().items(Joi.string()).required().min(0),
});

export function TransformValidationMessage(
  error: ValidationError,
): ValidationError {
  if (error.details && error.details.length) {
    error.message = error.details
      .map((d) => `${d.message} (${d.path.join('.')})`)
      .join('. ');
  }
  return error;
}
