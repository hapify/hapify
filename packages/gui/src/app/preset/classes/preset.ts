import { IPreset, IPresetBase } from '../interfaces/preset';
import { IModel, IModelBase, Model } from '../../model/model.module';

export class Preset implements IPreset {
  /** Constructor */
  constructor() {}

  public id = '';
  public icon = '';
  public name = '';
  // tslint:disable-next-line:variable-name
  public name__fr = '';
  public description = '';
  // tslint:disable-next-line:variable-name
  public description__fr = '';
  public models: IModel[] = [];

  public newModel(): IModel {
    return new Model();
  }

  public fromObject(object: IPresetBase): void {
    this.id = object.id;
    this.icon = object.icon;
    this.name = object.name;
    this.name__fr = object.name__fr;
    this.description = object.description;
    this.description__fr = object.description__fr;
    this.models = object.models.map(
      (modelBase: IModelBase): IModel => {
        const model = this.newModel();
        model.fromObject(modelBase);
        return model;
      },
    );
  }

  public toObject(): IPresetBase {
    return {
      id: this.id,
      icon: this.icon,
      name: this.name,
      name__fr: this.name__fr,
      description: this.description,
      description__fr: this.description__fr,
      models: this.models.map((model: IModel): IModelBase => model.toObject()),
    };
  }
}
