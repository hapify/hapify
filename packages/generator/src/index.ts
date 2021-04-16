import { Generator as Service } from './generators/generator';

export const Generator = new Service();
export { InternalError } from './errors/InternalError';
export { TimeoutError } from './errors/TimeoutError';
export { EvaluationError } from './errors/EvaluationError';
