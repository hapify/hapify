import { Service } from 'typedi';
import { ChannelsService } from './Channels';
import { InfoService } from './Info';
import { PresetsCollection } from '../class/PresetsCollection';
import { Model } from '../class/Model';
import { Field } from '../class/Field';

export interface PresetMergeResults {
	created: Model[];
	updated: Model[];
}

@Service()
export class PresetsService {
	constructor(private channelsService: ChannelsService, private infoService: InfoService) {}

	/** Returns the presets collection */
	async collection(): Promise<PresetsCollection> {
		return await PresetsCollection.getInstance();
	}

	/** Apply one preset to models */
	async apply(presetModels: Model[]): Promise<PresetMergeResults> {
		// Add or update each models
		const updated: Model[] = [];
		const created: Model[] = [];

		// List
		const modelsCollection = await this.channelsService.modelsCollection();
		const models = await modelsCollection.list();
		const referencesMap: { [id: string]: string } = {};

		for (const model of presetModels) {
			const existing = models.find((m) => m.name.toLowerCase() === model.name.toLowerCase());
			if (existing) {
				// Save incoming reference to existing reference
				referencesMap[model.id] = existing.id;
				// Add or skip each fields
				const clone = existing.clone(false);
				const existingHasPrimary = existing.fields.some((f) => f.primary);
				let edited = false;
				for (const field of model.fields) {
					// Prevent adding primary key if already exists
					if (existingHasPrimary && field.primary) {
						continue;
					}
					// Add this field if nothing with the same name was found
					if (!clone.fields.some((f) => f.name.toLowerCase() === field.name.toLowerCase())) {
						clone.fields.push(field);
						edited = true;
					}
				}
				if (edited) {
					updated.push(clone);
				}
			} else {
				// Clone model with new id
				const clone = model.clone(true);
				// Save incoming reference to existing reference
				referencesMap[model.id] = clone.id;

				const defaultFields = (await this.infoService.fields()).map((f) => new Field(f));

				// Apply special properties to primary field
				const defaultPrimary = defaultFields.find((f) => f.primary);
				const clonePrimary = clone.fields.find((f) => f.primary);
				if (defaultPrimary && clonePrimary) {
					// Apply clone primary properties to default primary
					defaultPrimary.ownership = clonePrimary.ownership;
					// Remove primary from clone
					clone.fields = clone.fields.filter((f) => !f.primary);
				}

				clone.fields = defaultFields.concat(clone.fields);
				created.push(clone);
			}
		}

		// Change references to existing models
		const changeReferencesToNewModels = (m: Model) => {
			for (const f of m.fields) {
				if (f.type === 'entity' && typeof f.value === 'string' && typeof referencesMap[f.value] === 'string') {
					f.value = referencesMap[f.value];
				}
			}
		};
		updated.forEach(changeReferencesToNewModels);
		created.forEach(changeReferencesToNewModels);

		// Return results
		return {
			updated,
			created,
		};
	}
}
