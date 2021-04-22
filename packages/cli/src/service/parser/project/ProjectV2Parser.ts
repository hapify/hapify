import { DeepRequired } from 'ts-essentials';

import { IV2StorableCompactProject } from '../../../interface/legacy/v2/Storage';
import { IStorableCompactProject } from '../../../interface/Storage';
import { VersionedObjectParser } from '../../../interface/Version';

export class ProjectV2Parser
  implements VersionedObjectParser<IStorableCompactProject> {
  convert(
    input: IV2StorableCompactProject,
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
          value: field.value,
          properties: field.properties,
          notes: field.notes,
          meta: undefined,
        })),
        notes: model.notes,
        meta: undefined,
      })),
    };
  }
}
