import { ITemplate, ITemplateBase } from './template';
import { IStorable, IStorableBase } from '@app/interfaces/storable';

export interface IChannelBase extends IStorableBase {
  /** The channel's name */
  name: string;
  /** The channel's description */
  description: string;
  /** The channel's logo */
  logo: string;
  /** The templates of the channel */
  templates: ITemplateBase[];
  /** The channel's validation script */
  validator: string;
}

export interface IChannel extends IChannelBase, IStorable {
  /** The templates of the channel */
  templates: ITemplate[];

  /** Denotes if the template should be considered as empty */
  isEmpty(): boolean;

  /** Returns a new template instance */
  newTemplate(): ITemplate;

  /** Push a new template */
  addTemplate(template: ITemplate): void;

  /** Remove a template */
  removeTemplate(template: ITemplate): void;

  /** Remove empty templates */
  filter(): void;

  /** Convert the instance to an object */
  toObject(): IChannelBase;
}
