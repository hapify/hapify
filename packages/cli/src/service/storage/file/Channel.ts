import * as Path from 'path';

import * as Fs from 'fs-extra';
import { Service } from 'typedi';

import { IConfig } from '../../../interface/Config';
import { IStorableCompactConfig } from '../../../interface/Storage';
import { VersionedObject } from '../../../interface/Version';
import { ConverterService } from '../../Converter';
import { ChannelParser } from '../../parser/channel/ChannelParser';
import { FilePath, JoinPath, SingleSaveFileStorage } from './SingleSave';

@Service()
export class ChannelFileStorageService extends SingleSaveFileStorage<IConfig> {
  constructor(private converterService: ConverterService) {
    super();
  }

  protected async serialize(content: IConfig): Promise<string> {
    const compact: IStorableCompactConfig = {
      version: content.version,
      validatorPath: content.validatorPath,
      project: content.project,
      name: content.name || undefined,
      description: content.description || undefined,
      logo: content.logo || undefined,
      defaultFields: content.defaultFields
        ? content.defaultFields.map((f) =>
            this.converterService.convertFieldToCompactFormat(f),
          )
        : undefined,
      templates: content.templates,
    };
    return JSON.stringify(compact, null, 2);
  }

  protected async deserialize(content: string): Promise<IConfig> {
    try {
      const parsedContent: VersionedObject = JSON.parse(content);
      const compact = new ChannelParser(parsedContent).convert();
      return {
        version: compact.version,
        validatorPath: compact.validatorPath,
        project: compact.project,
        name: compact.name,
        description: compact.description,
        logo: compact.logo,
        defaultFields: compact.defaultFields
          ? compact.defaultFields.map((f) =>
              this.converterService.convertFieldFromCompactFormat(f),
            )
          : undefined,
        templates: compact.templates,
      };
    } catch (error) {
      throw new Error(
        `An error occurred while parsing Channel configuration: ${error.toString()}`,
      );
    }
  }

  /** Cleanup unused files */
  async cleanup(root: FilePath, legitFiles: FilePath[]): Promise<void> {
    const joinedRoot = JoinPath(root);
    const joinedLegitFiles = legitFiles.map(JoinPath);

    const allFiles = ChannelFileStorageService.listAllFiles(joinedRoot);
    for (const filePath of allFiles) {
      if (joinedLegitFiles.indexOf(filePath) < 0) {
        Fs.unlinkSync(filePath);
      }
    }

    ChannelFileStorageService.clearEmptyDirectories(joinedRoot);
  }

  /** Get all files' absolute path from a directory */
  private static listAllFiles(rootPath: string): string[] {
    // Read the whole directory
    const entries = Fs.readdirSync(rootPath).map((dir) =>
      Path.join(rootPath, dir),
    );

    // Get sub-files
    const subFiles = entries
      .filter((subPath) => Fs.statSync(subPath).isDirectory())
      .map((subPath) => ChannelFileStorageService.listAllFiles(subPath))
      .reduce(
        (flatten: string[], files: string[]) => flatten.concat(files),
        [],
      );

    // Return files and sub-files
    return entries
      .filter((subPath) => Fs.statSync(subPath).isFile())
      .concat(subFiles);
  }

  /** Delete all directories if empty */
  private static clearEmptyDirectories(rootPath: string): void {
    // Remove sub-directories
    Fs.readdirSync(rootPath)
      .map((dir) => Path.join(rootPath, dir))
      .filter((subPath) => Fs.statSync(subPath).isDirectory())
      .forEach((subPath) =>
        ChannelFileStorageService.clearEmptyDirectories(subPath),
      );

    // Count remaining files & dirs
    const count = Fs.readdirSync(rootPath).length;

    if (count === 0) {
      Fs.rmdirSync(rootPath);
    }
  }
}
