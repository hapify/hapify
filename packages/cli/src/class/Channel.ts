import * as Path from 'path';
import md5 from 'md5';
import { Container } from 'typedi';
import { ISerializable, IStorable } from '../interface/Storage';
import { IChannel } from '../interface/Objects';
import { IConfig } from '../interface/Config';
import { Template } from './Template';
import { Validator } from './Validator';
import { Project } from './Project';
import { ModelsCollection } from './ModelsCollection';
import { ChannelFileStorageService } from '../service/storage/file/Channel';
import { ConfigSchema } from '../interface/schema/Config';
import { TransformValidationMessage } from '../interface/schema/ValidatorResult';
import { VersionService } from '../service/Version';

export class Channel implements IStorable, ISerializable<IChannel, Channel> {
	public name: string;

	public id: string;

	private static hapifyFolders = ['.hapify', 'hapify'];

	private static configFile = 'hapify.json';
	private static projectFile = 'hapify-models.json';

	public config: IConfig;
	/** Templates instances */
	public templates: Template[] = [];
	/** Templates instances */
	public validator: Validator;
	/** Current project */
	public project: Project;
	/** List of models container */
	public modelsCollection: ModelsCollection;

	public templatesPath: string;
	/** Channel storage */
	private storageService: ChannelFileStorageService;

	constructor(public path: string, name: string = null) {
		this.storageService = Container.get(ChannelFileStorageService);
		this.name = name ? name : Path.basename(path);
		this.id = md5(this.path);
		this.templatesPath = Path.join(this.path, this.guessHapifyFolder());
	}

	async load(): Promise<void> {
		// Get config from storage
		const config = await this.readConfigFile();

		// Validate the incoming config
		const validation = ConfigSchema.validate(config);
		if (validation.error) {
			// Transform Joi message
			TransformValidationMessage(validation.error);
			throw validation.error;
		}

		// Apply configuration
		this.config = config;

		// Override default name if given
		if (this.config.name) {
			this.name = this.config.name;
		}

		// Load project
		this.project = await Project.getInstance(this.guessProjectIdOrPath());

		// Load each content file
		for (let i = 0; i < this.config.templates.length; i++) {
			const template = new Template(this, Object.assign(this.config.templates[i], { content: '' }));
			await template.load();
			this.templates.push(template);
		}

		// Load models
		this.modelsCollection = await ModelsCollection.getInstance(this.project);

		// Load validator
		this.validator = new Validator(this, this.config.validatorPath);
		await this.validator.load();
	}

	async save(): Promise<void> {
		// Saves subs instances
		for (const template of this.templates) {
			await template.save();
		}
		await this.validator.save();

		// Update configurations
		this.config.templates = this.templates.map((m) => {
			const t = m.toObject();
			delete t.content;
			return t;
		});
		this.config.validatorPath = this.validator.path;

		// Write file if necessary
		await this.storageService.set([this.path, Channel.configFile], this.config);

		// Cleanup files in template path
		const legitFiles = this.templates.map((t) => [this.templatesPath, t.contentPath]);
		legitFiles.push([this.path, this.config.validatorPath]);
		await this.storageService.cleanup([this.path, this.guessHapifyFolder()], legitFiles);
	}

	private guessHapifyFolder(): string {
		const existingPath = Channel.hapifyFolders.find((path) => this.storageService.exists([this.path, path]));
		return existingPath ? existingPath : Channel.hapifyFolders[0];
	}

	/** Denotes if the template should be considered as empty */
	isEmpty(): boolean {
		const validatorIsEmpty = this.validator.isEmpty();
		const templatesAreEmpty = this.templates.every((t) => t.isEmpty());
		return validatorIsEmpty && templatesAreEmpty;
	}

	/** Remove empty templates */
	filter(): void {
		this.templates = this.templates.filter((t) => !t.isEmpty());
	}

	/** Determines if the project is an id or not and resolve path if necessary */
	guessProjectIdOrPath() {
		if (!Project.isRemoteId(this.config.project) && !Path.isAbsolute(this.config.project)) {
			return Path.resolve(this.path, this.config.project);
		}
		return this.config.project;
	}

	/** Change project in config file */
	public static async changeProject(path: string, project: string): Promise<void> {
		if (!(await Channel.configExists(path))) {
			throw new Error(`Cannot find config file in ${path}`);
		}
		const storage = Container.get(ChannelFileStorageService);
		// Get config from storage
		const config = await storage.get([path, Channel.configFile]);
		// Set value and save config
		config.project = project;
		await storage.set([path, Channel.configFile], config);
	}

	/** Returns the config from ori file */
	public async readConfigFile(): Promise<IConfig> {
		if (!(await this.storageService.exists([this.path, Channel.configFile]))) {
			throw new Error(`Channel config's path ${this.path}/${Channel.configFile} does not exists.`);
		}
		return await this.storageService.get([this.path, Channel.configFile]);
	}
	/** Denotes if the config file exists */
	public static async configExists(path: string): Promise<boolean> {
		return Container.get(ChannelFileStorageService).exists([path, Channel.configFile]);
	}
	/** Init a Hapify structure within a directory */
	public static async create(path: string, name?: string, description?: string, logo?: string): Promise<Channel> {
		if (await Channel.configExists(path)) {
			throw new Error(`A channel already exists in this directory.`);
		}

		// Create a channel from scratch
		const channel = new Channel(path);
		channel.config = {
			version: Container.get(VersionService).getCurrentVersion('channel'),
			validatorPath: `${Channel.hapifyFolders[0]}/validator.js`,
			name: name || channel.name,
			description: description || 'A new Hapify channel',
			logo: logo || undefined,
			project: Channel.projectFile,
			defaultFields: [
				{
					name: 'Id',
					type: 'string',
					subtype: null,
					value: null,
					primary: true,
					unique: false,
					label: false,
					nullable: false,
					multiple: false,
					embedded: false,
					searchable: false,
					sortable: false,
					hidden: false,
					internal: true,
					restricted: false,
					ownership: false,
				},
			],
			templates: [
				{
					path: 'models/{kebab}/hello.js',
					engine: 'hpf',
					input: 'one',
				},
			],
		};

		// Create template
		const template = new Template(
			channel,
			Object.assign(channel.config.templates[0], {
				content: '// Hello <<Model pascal>>',
			})
		);
		channel.templates.push(template);

		// Create validator
		channel.validator = new Validator(channel, channel.config.validatorPath);
		channel.validator.content = `// Models validation script\nreturn { errors: [], warnings: [] };`;

		// Save channel
		return channel;
	}

	public fromObject(object: IChannel): Channel {
		// Do not update name nor id
		// Create or update templates if necessary
		// By keeping the same instances, we will avoid a file saving if the content did not change
		this.templates = object.templates.map((t) => {
			// Try to find an existing template
			const existing = this.templates.find((e) => e.path === t.path);
			if (existing) {
				return existing.fromObject(t);
			}
			// Otherwise create a new template
			return new Template(this, t);
		});

		// Update validator
		this.validator.content = object.validator;

		return this;
	}

	public toObject(): IChannel {
		return {
			id: this.id,
			name: this.name,
			description: this.config.description || null,
			logo: this.config.logo || null,
			templates: this.templates.map((template: Template) => template.toObject()),
			validator: this.validator.content,
		};
	}
}
