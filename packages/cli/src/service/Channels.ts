import { Service } from 'typedi';
import * as Path from 'path';
import { OptionsService } from './Options';
import * as Fs from 'fs-extra';
import Hoek from '@hapi/hoek';
import { Channel } from '../class/Channel';
import { ModelsCollection } from '../class/ModelsCollection';
import { Project } from '../class/Project';

@Service()
export class ChannelsService {
	/** Channels instances */
	private _channels: Channel[];

	constructor(private optionsService: OptionsService) {}

	/** Get the channels. Load them if not loaded yet */
	public async channels(): Promise<Channel[]> {
		if (!(this._channels instanceof Array)) {
			this._channels = await ChannelsService.sniff(this.optionsService.dir(), this.optionsService.depth());
			if (this._channels.length === 0) {
				throw new Error('No channel found');
			}
			for (const channel of this._channels) {
				await channel.load();
			}
		}
		return this._channels;
	}

	/** Ensure that all channels refers to the same project */
	public async ensureSameProject(): Promise<void> {
		const channels = await this.channels();
		const firstProject = channels[0].guessProjectIdOrPath();
		for (const channel of channels) {
			if (channel.guessProjectIdOrPath() !== firstProject) {
				throw new Error('Channels must refer to the same project');
			}
		}
	}

	/** Ensure that all channels define the same default fields */
	public async ensureSameDefaultFields(): Promise<void> {
		// Get defined fields
		const channels = await this.channels();
		const fieldsGroup = channels.filter((c) => !!c.config.defaultFields).map((c) => c.config.defaultFields);
		if (fieldsGroup.length < 2) {
			return;
		}
		// Compare each fields group to the first one
		const ref = fieldsGroup[0];
		for (let i = 1; i < fieldsGroup.length; i++) {
			if (!Hoek.deepEqual(ref, fieldsGroup[i])) {
				throw new Error('Default fields must match for all channels if defined');
			}
		}
	}

	/**
	 * Change project in all found channels from a given or current dir
	 * This change the project without loading the channels
	 */
	public async changeRemoteProject(project: string): Promise<void> {
		const channels = await ChannelsService.sniff(this.optionsService.dir(), this.optionsService.depth());
		if (channels.length === 0) {
			throw new Error('No channel found');
		}
		for (const channel of channels) {
			await Channel.changeProject(channel.path, project);
		}
	}

	/**
	 * Use the same local project for all found channels
	 * This change the project without loading the channels
	 */
	public async mergeLocalProjects(): Promise<boolean> {
		// Try to find channels
		const channels = await ChannelsService.sniff(this.optionsService.dir(), this.optionsService.depth());
		if (channels.length === 0) {
			throw new Error('No channel found');
		}

		// If the one channel's project is local, use this project as reference and bind all other channels to this project
		let mainChannel;
		let mainChannelProjectPath;
		for (const channel of channels) {
			const projectPath = await this.resolveLocalProjectPath(channel);
			if (projectPath) {
				mainChannel = channel;
				mainChannelProjectPath = projectPath;
				break;
			}
		}

		if (!mainChannel) {
			// The user should choose a remote project
			return false;
		}

		for (const channel of channels) {
			if (channel === mainChannel) continue;

			// Remove project file
			const projectPath = await this.resolveLocalProjectPath(channel);
			if (projectPath && Fs.existsSync(projectPath)) {
				Fs.unlinkSync(projectPath);
			}

			// Get relative path
			const newPath = Path.relative(Path.resolve(channel.path), mainChannelProjectPath);

			await Channel.changeProject(channel.path, newPath);
		}

		return true;
	}

	/** Returns null if the project is not local */
	private async resolveLocalProjectPath(channel: Channel): Promise<string> {
		const config = await channel.readConfigFile();
		if (Project.isRemoteId(config.project)) return null;
		return Path.isAbsolute(config.project) ? config.project : Path.resolve(channel.path, config.project);
	}

	/** Returns the first models collection */
	public async modelsCollection(): Promise<ModelsCollection> {
		const channels = await this.channels();
		return channels[0].modelsCollection;
	}

	/**
	 * This method detect all channels in the directory and its sub-directories, and create instances for them.
	 * We can define the depth level of subdirectories.
	 */
	private static async sniff(path: string, depth: number = 2, from: string = path): Promise<Channel[]> {
		// Get channels in sub-directories first
		const channels: Channel[] =
			depth <= 0
				? []
				: (
						await Promise.all(
							Fs.readdirSync(path)
								.map((dir) => Path.join(path, dir))
								.filter((subPath) => Fs.statSync(subPath).isDirectory())
								.map((subPath) => ChannelsService.sniff(subPath, depth - 1, from))
						)
				  ).reduce((flatten: Channel[], channels: Channel[]) => flatten.concat(channels), []);

		// Get channel of current directory if exists
		if (await Channel.configExists(path)) {
			const name = Path.relative(Path.dirname(from), path);
			const channel = new Channel(path, name);
			channels.push(channel);
		}

		return channels;
	}
}
