import { IInternalConfig } from '../interface/Config';

export const InternalConfig: IInternalConfig = {
	validatorTimeout: 1000,
	limits: {
		projects: 1000,
		models: 1000,
		fields: 1000,
		templates: 1000,
	},
};
