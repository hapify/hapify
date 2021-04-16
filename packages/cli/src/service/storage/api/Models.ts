import { Service } from 'typedi';
import { BaseApiStorageService, BaseSearchParams } from './Base';
import md5 from 'md5';
import { IModel } from '../../../interface/Generator';
import { Model } from '../../../class/Model';
import { VersionedObject } from '../../../interface/Version';
import { ApiModelParser } from '../../parser/model/ApiModelParser';
import { IApiModel } from '../../../interface/Api';
import { OptionsService } from '../../Options';
import { ConverterService } from '../../Converter';

interface ModelsSearchParams extends BaseSearchParams {
	version?: string;
	project?: string;
	name?: string;
}

@Service()
export class ModelsApiStorageService extends BaseApiStorageService<IModel, IApiModel, ModelsSearchParams> {
	/** The models fingerprints */
	private hashes: { [id: string]: string } = {};

	constructor(optionsService: OptionsService, private converterService: ConverterService) {
		super(optionsService);
	}

	/** Load the models from api for a specific project */
	async forProject(project: string): Promise<IModel[]> {
		const models: IModel[] = await this.list({ project });
		this.updateHashes(models);
		return models;
	}

	/** Send models to API if necessary */
	async set(project: string, models: IModel[]): Promise<IModel[]> {
		// Init map to match temp id to real id
		const referencesMap: { [id: string]: string } = {};

		// ========================================================
		// CREATION
		// Get models to create
		const toCreate = models.filter((m) => typeof this.hashes[m.id] === 'undefined');

		// Create models and update id
		for (const model of toCreate) {
			const response = await this.create({
				project: project,
				name: model.name,
				notes: model.notes || null,
				fields: model.fields.map((f) => this.converterService.convertFieldToCompactFormat(f)),
				accesses: model.accesses,
			});
			referencesMap[model.id] = response.id;
			model.id = response.id;
		}
		// ========================================================

		// ========================================================
		// DELETION
		// Get models to delete
		const toDelete = Object.keys(this.hashes).filter((id) => !models.some((m) => m.id === id));
		// Delete models
		for (const id of toDelete) {
			await this.remove(id);
			referencesMap[id] = null;
		}
		// ========================================================

		// ========================================================
		// UPDATE
		// Get models to update
		const toUpdate = models.filter((m) => typeof this.hashes[m.id] === 'string' && this.hashes[m.id] !== ModelsApiStorageService.hash(m));
		// Update models
		for (const model of toUpdate) {
			await this.update(model.id, {
				name: model.name,
				notes: model.notes || null,
				fields: model.fields.map((f) => this.converterService.convertFieldToCompactFormat(f)),
				accesses: model.accesses,
			});
		}
		// ========================================================

		// ========================================================
		// UPDATE REFERENCES
		/** Change references from temp id to real id and denotes if a change was made */
		const changeReferencesToNewModels = (m: IModel): boolean => {
			let changed = false;
			for (const f of m.fields) {
				if (f.type === 'entity' && typeof f.value === 'string' && typeof referencesMap[f.value] !== 'undefined') {
					f.value = referencesMap[f.value];
					changed = true;
				}
			}
			return changed;
		};
		// Parse all models and change references
		for (const model of models) {
			if (changeReferencesToNewModels(model)) {
				await this.update(model.id, {
					fields: model.fields.map((f) => this.converterService.convertFieldToCompactFormat(f)),
				});
			}
		}
		// ========================================================

		this.updateHashes(models);

		// Return updated models
		return models;
	}

	/** Update hashes from models */
	private updateHashes(models: IModel[]) {
		this.hashes = {};
		for (const model of models) {
			this.hashes[model.id] = ModelsApiStorageService.hash(model);
		}
	}

	/** Create a hash for the model */
	private static hash(model: IModel): string {
		return md5(JSON.stringify(new Model(model).toObject()));
	}

	protected defaultSearchParams(): any {
		const s = super.defaultSearchParams();
		s._limit = this.remoteConfig.modelsLimit;
		return s;
	}

	protected path(): string {
		return 'model';
	}

	protected convertToCurrentVersion(object: VersionedObject | IApiModel): IApiModel {
		return new ApiModelParser(object).convert();
	}

	protected fromApi(object: IApiModel): IModel {
		return {
			id: object._id,
			name: object.name,
			notes: object.notes || null,
			fields: object.fields.map((f) => this.converterService.convertFieldFromCompactFormat(f)),
			accesses: object.accesses,
		};
	}

	protected requiresAuthentication(): boolean {
		return true;
	}
}
