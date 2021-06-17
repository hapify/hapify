import { DeepRequired } from 'ts-essentials';
import { Service } from 'typedi';

import { IApiPreset } from '../../../interface/Api';
import { IPreset } from '../../../interface/Objects';
import { VersionedObject } from '../../../interface/Version';
import { ConverterService } from '../../Converter';
import { OptionsService } from '../../Options';
import { ApiPresetParser } from '../../parser/preset/ApiPresetParser';
import { VersionService } from '../../Version';
import { BaseApiStorageService, BaseSearchParams } from './Base';

interface PresetsSearchParams extends BaseSearchParams {
  version?: string;
  name?: string;
  slug?: string;
  models?: string[];
}

@Service()
export class PresetsApiStorageService extends BaseApiStorageService<
  IPreset,
  IApiPreset,
  PresetsSearchParams
> {
  constructor(
    optionsService: OptionsService,
    private converterService: ConverterService,
    private versionService: VersionService,
  ) {
    super(optionsService);
  }

  protected defaultSearchParams(): any {
    const s = super.defaultSearchParams();
    s._limit = this.remoteConfig.presetsLimit;
    s.version = this.versionService.getCurrentVersion('preset');
    return s;
  }

  protected path(): string {
    return 'preset';
  }

  protected convertToCurrentVersion(
    object: VersionedObject | IApiPreset,
  ): IApiPreset {
    return new ApiPresetParser(object).convert();
  }

  protected fromApi(object: IApiPreset): DeepRequired<IPreset> {
    return {
      id: object._id,
      name: object.name,
      name__fr: object.name__fr,
      description: object.description,
      description__fr: object.description__fr,
      icon: object.icon,
      models: object.models.map((m) => ({
        id: m._id,
        name: m.name,
        notes: m.notes || null,
        meta: m.meta || null,
        fields: m.fields.map((f) =>
          this.converterService.convertFieldFromCompactFormat(f),
        ),
        accesses: m.accesses,
      })),
    };
  }

  protected requiresAuthentication(): boolean {
    return false;
  }
}
