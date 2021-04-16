import { VersionedObjectParser } from '../../../interface/Version';
import { IV1Config } from '../../../interface/legacy/v1/Config';
import { IStorableCompactConfig } from '../../../interface/Storage';
import { Container } from 'typedi';
import { ConverterService } from '../../Converter';

export class ChannelV1Parser implements VersionedObjectParser<IStorableCompactConfig> {
	private converterService: ConverterService;

	constructor() {
		this.converterService = Container.get(ConverterService);
	}

	convert(input: IV1Config): IStorableCompactConfig {
		return {
			version: '2',
			validatorPath: input.validatorPath,
			project: input.project,
			name: input.name,
			description: input.description,
			logo: input.logo,
			defaultFields: input.defaultFields
				? input.defaultFields.map((f) => ({
						name: f.name,
						type: f.type,
						subtype: f.subtype,
						value: f.reference,
						properties: this.converterService.convertBooleanPropertiesToCompactFormat(f),
						notes: f.notes,
				  }))
				: undefined,
			templates: input.templates,
		};
	}
}
