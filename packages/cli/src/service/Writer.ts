import { Service } from 'typedi';
import * as Fs from 'fs-extra';
import * as Path from 'path';
import JSZip from 'jszip';
import { IGeneratorResult } from '../interface/Generator';

@Service()
export class WriterService {
	constructor() {}

	/** Zip results and write to disk */
	async zip(path: string, results: IGeneratorResult[]): Promise<void> {
		// Create ZIP
		const zip = new JSZip();
		// Append files
		for (const result of results) {
			zip.file(result.path, result.content);
		}
		// Generate ZIP
		const content = await zip.generateAsync({
			type: 'nodebuffer',
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9,
			},
		});
		Fs.ensureDirSync(Path.dirname(path));
		Fs.writeFileSync(path, content);
	}

	/** Write results to disk */
	async writeMany(root: string, results: IGeneratorResult[]): Promise<void> {
		for (const result of results) {
			await this.write(root, result);
		}
	}

	/** Write on result to disk */
	async write(root: string, result: IGeneratorResult): Promise<void> {
		const path = Path.join(root, result.path);
		Fs.ensureDirSync(Path.dirname(path));
		Fs.writeFileSync(path, result.content, 'utf8');
	}
}
