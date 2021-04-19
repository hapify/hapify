import { IApiPreset } from '../../../interface/Api';
import { IV1ApiPreset } from '../../../interface/legacy/v1/Api';
import { VersionedObjectParser } from '../../../interface/Version';
import { ApiModelParser } from '../model/ApiModelParser';

export class ApiPresetV1Parser implements VersionedObjectParser<IApiPreset> {
  convert(input: IV1ApiPreset): IApiPreset {
    return {
      version: '2',
      _id: input._id,
      models: input.models.map((model) => new ApiModelParser(model).convert()),
      name: input.name,
      name__fr: input.name__fr,
      slug: input.slug,
      icon: input.icon,
      description: input.description,
      description__fr: input.description__fr,
      created_at: input.created_at,
    };
  }
}
