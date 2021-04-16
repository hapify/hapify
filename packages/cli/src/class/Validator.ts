import { Container } from 'typedi';
import { IStorable } from '../interface/Storage';
import { ValidatorFileStorageService } from '../service/storage/file/Validator';
import { Channel } from './Channel';

export class Validator implements IStorable {
	/** The validator's script content */
	content: string;
	/** Validator storage */
	private storageService: ValidatorFileStorageService;

	constructor(private parent: Channel, public path: string) {
		this.storageService = Container.get(ValidatorFileStorageService);
	}

	public async load(): Promise<void> {
		await this.validate();
		this.content = await this.storageService.get([this.parent.path, this.path]);
	}

	async save(): Promise<void> {
		await this.storageService.set([this.parent.path, this.path], this.content);
	}

	/** Check resource validity */
	private async validate(): Promise<void> {
		if (!(await this.storageService.exists([this.parent.path, this.path]))) {
			throw new Error(`Validator's path ${this.parent.path}/${this.path} does not exists.`);
		}
	}

	/** Denotes if the validator should be considered as empty */
	public isEmpty(): boolean {
		return typeof this.content !== 'string' || this.content.trim().length === 0;
	}
}
