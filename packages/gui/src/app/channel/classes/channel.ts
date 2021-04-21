import { IChannel, IChannelBase } from '../interfaces/channel';
import { ITemplate, ITemplateBase } from '../interfaces/template';
import { Template } from './template';

function p8(s?: boolean): string {
  const p = (`${Math.random().toString(16)  }000000000`).substr(2, 8);
  return s ? `-${  p.substr(0, 4)  }-${  p.substr(4, 4)}` : p;
}

export class Channel implements IChannel {
  /**
   * Constructor
   * Auto-generate unique id
   */
  constructor() {
    this.id = this.guid();
  }

  public id: string;

  public name = '';

  public description = null;

  public logo = null;

  public validator = '';

  public templates: ITemplate[] = [];

  /** Randomly generate id */
  protected guid(): string {
    return p8() + p8(true) + p8(true) + p8();
  }

  public newTemplate(): ITemplate {
    return new Template(this);
  }

  public addTemplate(template: ITemplate): void {
    this.templates.push(template);
  }

  public removeTemplate(template: ITemplate): void {
    this.templates = this.templates.filter((t: ITemplate) => t !== template);
  }

  public fromObject(object: IChannelBase): void {
    this.id = object.id;
    this.name = object.name;
    this.description = object.description;
    this.logo = object.logo;
    this.templates = object.templates.map(
      (templateBase: ITemplateBase): ITemplate => {
        const template = this.newTemplate();
        template.fromObject(templateBase);
        return template;
      },
    );
    this.validator = object.validator;
  }

  public toObject(): IChannelBase {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      logo: this.logo,
      templates: this.templates
        .filter((template: ITemplate): boolean => !template.isEmpty())
        .map((template: ITemplate): ITemplateBase => template.toObject()),
      validator: this.validator,
    };
  }

  public isEmpty(): boolean {
    const nameIsEmpty = typeof this.name !== 'string' || this.name.length === 0;
    const templatesAreEmpty = this.templates.every(
      (template: ITemplate): boolean => template.isEmpty(),
    );

    return nameIsEmpty || templatesAreEmpty;
  }

  public filter(): void {
    this.templates = this.templates.filter((template: ITemplate): boolean => !template.isEmpty());
  }
}
