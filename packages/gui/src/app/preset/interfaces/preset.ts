import { IModel, IModelBase } from '../../model/model.module';
import { IStorable, IStorableBase } from '@app/interfaces/storable';

export interface IPresetBase extends IStorableBase {
	/** The preset icon */
	icon: string;
	/** The preset's name */
	name: string;
	/** The preset's name in french */
	name__fr: string;
	/** The preset's name */
	description: string;
	/** The preset's name in french */
	description__fr: string;
	/** The models of the preset */
	models: IModelBase[];
}

export interface IPreset extends IPresetBase, IStorable {
	/** The models of the preset */
	models: IModel[];

	/** Convert the instance to an object */
	toObject(): IPresetBase;
}
