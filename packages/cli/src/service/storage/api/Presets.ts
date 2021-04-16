import { Service } from 'typedi';
import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IModel } from '../../../interface/Generator';
import { IPreset } from '../../../interface/Objects';
import { IApiModel, IApiPreset } from '../../../interface/Api';
import { OptionsService } from '../../Options';
import { ConverterService } from '../../Converter';
import { VersionedObject } from '../../../interface/Version';
import { ApiPresetParser } from '../../parser/preset/ApiPresetParser';
import { VersionService } from '../../Version';

interface PresetsSearchParams extends BaseSearchParams {
	version?: string;
	name?: string;
	slug?: string;
	models?: string[];
}

@Service()
export class PresetsApiStorageService extends BaseApiStorageService<IPreset, IApiPreset, PresetsSearchParams> {
	constructor(optionsService: OptionsService, private converterService: ConverterService, private versionService: VersionService) {
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

	protected convertToCurrentVersion(object: VersionedObject | IApiPreset): IApiPreset {
		return new ApiPresetParser(object).convert();
	}

	protected fromApi(object: IApiPreset): IPreset {
		return {
			id: object._id,
			name: object.name,
			name__fr: object.name__fr,
			description: object.description,
			description__fr: object.description__fr,
			icon: object.icon,
			models: object.models.map(
				(m: IApiModel): IModel => ({
					id: m._id,
					name: m.name,
					notes: m.notes || null,
					fields: m.fields.map((f) => this.converterService.convertFieldFromCompactFormat(f)),
					accesses: m.accesses,
				})
			),
		};
	}

	protected requiresAuthentication(): boolean {
		return false;
	}
}
