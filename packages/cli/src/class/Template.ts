import { Container } from 'typedi';

import { IConfigTemplate } from '../interface/Config';
import {
  Engine,
  Input,
  IStringVariants,
  ITemplate,
} from '../interface/Generator';
import { ISerializable, IStorable } from '../interface/Storage';
import { TemplatesFileStorageService } from '../service/storage/file/Template';
import { StringService } from '../service/String';
import type { Channel } from './Channel';

export class Template
  implements IStorable, ISerializable<ITemplate, Template>, ITemplate {
  /** Template storage */
  private storageService: TemplatesFileStorageService;

  /** The template's path */
  path: string;

  /** The template's type */
  engine: Engine;

  /** Denotes if the template has to to be ran for one or all models */
  input: Input;

  /** The template's path */
  contentPath: string;

  /** @deprecated Old template paths */
  legacyContentPaths: string[];

  /** The template's content */
  content: string;

  constructor(private parent: Channel, object?: ITemplate) {
    this.storageService = Container.get(TemplatesFileStorageService);
    if (object) {
      this.fromObject(object);
    }
  }

  public fromObject(object: ITemplate): Template {
    this.path = object.path;
    this.engine = object.engine;
    this.input = object.input;
    this.content = object.content;
    this.contentPath = Template.computeContentPath(this);
    this.legacyContentPaths = [Template.computeContentPathV1(this)];
    return this;
  }

  public toObject(): ITemplate {
    return {
      path: this.path,
      engine: this.engine,
      input: this.input,
      content: this.content,
    };
  }

  /** Denotes if the template should be considered as empty */
  public isEmpty(): boolean {
    return typeof this.content !== 'string' || this.content.trim().length === 0;
  }

  /** Denotes if the template needs a specific model to be generated */
  public needsModel(): boolean {
    return this.input === 'one';
  }

  /** Get the extension of the input file */
  public extension(): string {
    return Template.computeExtension(this);
  }

  /** Get the parent channel */
  public channel(): Channel {
    return this.parent;
  }

  public async load(): Promise<void> {
    const contentPath = this.findContentPath();
    this.content = await this.storageService.get([
      this.parent.templatesPath,
      contentPath,
    ]);
  }

  async save(): Promise<void> {
    await this.storageService.set(
      [this.parent.templatesPath, this.contentPath],
      this.content,
    );
  }

  private findContentPath(): string {
    const possiblePaths = [
      this.contentPath,
      ...(this.legacyContentPaths || []),
    ];
    const existingPath = possiblePaths.find((path) =>
      this.storageService.exists([this.parent.templatesPath, path]),
    );
    if (!existingPath) {
      throw new Error(`Cannot find template in ${possiblePaths.join(', ')}`);
    }
    return existingPath;
  }

  /** Compute the content path from the dynamic path */
  static computeContentPath(template: Template | IConfigTemplate): string {
    // Get string service
    const stringService: StringService = Container.get(StringService);

    const types = stringService.types();
    let { path } = template;
    for (const type of types) {
      path = path.replace(new RegExp(`{${type}}`, 'g'), `__${type}__`);
    }

    return `${path}.${Template.computeExtension(template)}`;
  }

  /** @deprecated */
  static computeContentPathV1(template: Template | IConfigTemplate): string {
    // Get string service
    const stringService: StringService = Container.get(StringService);

    const variants = stringService.variants('model');
    const keys = Object.keys(variants) as (keyof IStringVariants)[];
    let { path } = template;
    for (const key of keys) {
      path = path.replace(new RegExp(`{${key}}`, 'g'), variants[key]);
    }

    return `${path}.${Template.computeExtension(template)}`;
  }

  /** Compute the extension of the template */
  private static computeExtension(
    template: Template | IConfigTemplate,
  ): string {
    return template.engine;
  }
}
