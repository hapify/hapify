import md5 from 'md5';
import { Service } from 'typedi';
import * as Fs from 'fs-extra';
import * as Path from 'path';

export type FilePath = string | string[];
export function JoinPath(path: FilePath): string {
	return path instanceof Array ? Path.join(...path) : <string>path;
}

@Service()
export abstract class SingleSaveFileStorage<T> {
	/** The template's content's md5 hash */
	private contentMd5: { [bucket: string]: string } = {};
	/** Load content from path */
	async get(path: FilePath): Promise<T> {
		const contentPath = JoinPath(path);
		const content = <string>Fs.readFileSync(contentPath, 'utf8');
		this.didLoad(contentPath, content);
		return await this.deserialize(content);
	}
	/** Load content from path */
	async set(path: FilePath, input: T): Promise<void> {
		const content = await this.serialize(input);
		const contentPath = JoinPath(path);
		if (this.shouldSave(contentPath, content)) {
			Fs.ensureDirSync(Path.dirname(contentPath));
			Fs.writeFileSync(contentPath, content, 'utf8');
		}
	}
	/** Check if the resource exists */
	exists(path: FilePath): boolean {
		return Fs.existsSync(JoinPath(path));
	}
	/** Convert content to string before saving */
	protected abstract serialize(content: T): Promise<string>;
	/** Convert content to string before saving */
	protected abstract deserialize(content: string): Promise<T>;
	/** Should be called after loading to hash the content */
	protected didLoad(bucket: string, data: string): void {
		this.contentMd5[bucket] = md5(data);
	}
	/**
	 * Denotes if the data has changed and update the hash if necessary
	 * This method should not be called twice at the same time as it updates the hash.
	 */
	protected shouldSave(bucket: string, data: string): boolean {
		const contentMd5 = md5(data);
		if (typeof this.contentMd5[bucket] === 'undefined' || contentMd5 !== this.contentMd5[bucket]) {
			this.contentMd5[bucket] = contentMd5;
			return true;
		}
		return false;
	}
}
