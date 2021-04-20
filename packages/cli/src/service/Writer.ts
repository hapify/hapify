import * as Path from 'path';

import { ensureDirSync, writeFileSync } from 'fs-extra';
import JSZip from 'jszip';
import { Service } from 'typedi';

import { IGeneratorResult } from '../interface/Generator';

@Service()
export class WriterService {
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
    ensureDirSync(Path.dirname(path));
    writeFileSync(path, content);
  }

  /** Write results to disk */
  writeMany(root: string, results: IGeneratorResult[]): void {
    for (const result of results) {
      this.write(root, result);
    }
  }

  /** Write on result to disk */
  write(root: string, result: IGeneratorResult): void {
    const path = Path.join(root, result.path);
    ensureDirSync(Path.dirname(path));
    writeFileSync(path, result.content, 'utf8');
  }
}
