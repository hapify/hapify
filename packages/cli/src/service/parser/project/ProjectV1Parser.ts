import { VersionedObjectParser } from '../../../interface/Version';
import { IStorableCompactProject } from '../../../interface/Storage';
import { IV1StorableCompactProject } from '../../../interface/legacy/v1/Storage';

export class ProjectV1Parser implements VersionedObjectParser<IStorableCompactProject> {
	convert(input: IV1StorableCompactProject): IStorableCompactProject {
		return {
			version: '2',
			name: input.name,
			description: input.description,
			models: input.models.map((model) => ({
				id: model.id,
				name: model.name,
				accesses: model.accesses,
				fields: model.fields.map((field) => ({
					name: field.name,
					type: field.type,
					subtype: field.subtype,
					value: field.reference,
					properties: field.properties,
					notes: field.notes,
				})),
				notes: model.notes,
			})),
		};
	}
}
