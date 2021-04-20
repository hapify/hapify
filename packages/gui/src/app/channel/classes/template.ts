import { ITemplate, ITemplateBase } from '../interfaces/template';
import { TemplateEngine } from '../interfaces/template-engine.enum';
import { TemplateInput } from '../interfaces/template-input.enum';
import { IChannel } from '../interfaces/channel';

export class Template implements ITemplate {
	constructor(channel: IChannel) {
		this.channelValue = channel;
	}

	private readonly channelValue: IChannel;
	/** Stores the path value managed by getter/setter */
	private pathValue = '';
	/** Stores the type value managed by getter/setter */
	private typeValue: string = null;
	public engine = TemplateEngine.Hpf;
	public input = TemplateInput.One;
	public content = '';

	/** Split a string into path parts */
	private static split(path: string): string[] {
		return path
			.trim()
			.split(/[\/\\]/g)
			.filter((x) => x.length);
	}

	set path(value) {
		this.pathValue = Template.split(value).join('/');
		const parts = this.pathValue.split('.');
		this.typeValue = parts.length > 1 ? parts[parts.length - 1] : null;
	}

	get path(): string {
		return this.pathValue;
	}

	get type(): string {
		return this.typeValue;
	}

	public fromObject(object: ITemplateBase): void {
		this.path = object.path;
		this.engine = object.engine;
		this.input = object.input;
		this.content = object.content;
	}

	public toObject(): ITemplateBase {
		return {
			path: this.path,
			engine: this.engine,
			input: this.input,
			content: this.content,
		};
	}

	public extension(): string {
		if (this.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		if (this.engine === TemplateEngine.Ejs) {
			return 'ejs';
		}
		return 'js';
	}

	public aceMode(): string {
		if (this.engine === TemplateEngine.Hpf) {
			return 'hpf';
		}
		if (this.engine === TemplateEngine.Ejs) {
			return 'ejs';
		}
		return 'js';
	}

	public isEmpty(): boolean {
		return typeof this.content !== 'string' || this.content.trim().length === 0;
	}

	public needsModel(): boolean {
		return this.input === TemplateInput.One;
	}

	public clone(): ITemplate {
		const output = new Template(this.channelValue);
		output.fromObject(this.toObject());

		return output;
	}

	public channel(): IChannel {
		return this.channelValue;
	}

	splitPath(): string[] {
		return Template.split(this.path);
	}
}
