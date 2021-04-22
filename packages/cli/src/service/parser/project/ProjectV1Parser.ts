import { DeepRequired } from 'ts-essentials';
import { IV1StorableCompactProject } from '../../../interface/legacy/v1/Storage';
import { IStorableCompactProject } from '../../../interface/Storage';
import { VersionedObjectParser } from '../../../interface/Version';

export class ProjectV1Parser
  implements VersionedObjectParser<IStorableCompactProject> {
  convert(
    input: IV1StorableCompactProject,
  ): DeepRequired<IStorableCompactProject> {
    return {
      version: '3',
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
