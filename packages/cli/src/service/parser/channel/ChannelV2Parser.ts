import { DeepRequired } from 'ts-essentials';
import { IV2StorableCompactConfig } from '../../../interface/legacy/v2/Storage';
import { IStorableCompactConfig } from '../../../interface/Storage';
import { VersionedObjectParser } from '../../../interface/Version';

export class ChannelV2Parser
  implements VersionedObjectParser<IStorableCompactConfig> {
  convert(
    input: IV2StorableCompactConfig,
  ): DeepRequired<IStorableCompactConfig> {
    return {
      version: '3',
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
            value: f.value,
            properties: f.properties,
            notes: f.notes,
          }))
        : undefined,
      templates: input.templates,
    };
  }
}
