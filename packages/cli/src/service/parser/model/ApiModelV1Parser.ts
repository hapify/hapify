import { VersionedObjectParser } from '../../../interface/Version';
import { IV1ApiModel } from '../../../interface/legacy/v1/Api';
import { IApiModel } from '../../../interface/Api';
import { ConverterService } from '../../Converter';
import { Container } from 'typedi';

export class ApiModelV1Parser implements VersionedObjectParser<IApiModel> {
	private converterService: ConverterService;

	constructor() {
		this.converterService = Container.get(ConverterService);
	}

	convert(input: IV1ApiModel): IApiModel {
		return {
			version: '2',
			_id: input._id,
			created_at: input.created_at,
			updated_at: input.updated_at,
			owner: input.owner,
			project: input.project,
			name: input.name,
			notes: input.notes,
			fields: input.fields.map((f) => ({
				name: f.name,
				type: f.type,
				subtype: f.subtype,
				value: f.reference,
				properties: this.converterService.convertBooleanPropertiesToCompactFormat(f),
				notes: f.notes,
			})),
			accesses: input.accesses,
		};
	}
}
