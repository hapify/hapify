import * as Path from 'path';

import { readdirSync, rmdirSync, statSync, unlinkSync } from 'fs-extra';
import { DeepRequired } from 'ts-essentials';
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

  protected serialize(content: IConfig): string {
    const compact: DeepRequired<IStorableCompactConfig> = {
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

  protected deserialize(content: string): DeepRequired<IConfig> {
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
        `An error occurred while parsing Channel configuration: ${(error as Error).toString()}`,
      );
    }
  }

  /** Cleanup unused files */
  cleanup(root: FilePath, legitFiles: FilePath[]): void {
    const joinedRoot = JoinPath(root);
    const joinedLegitFiles = legitFiles.map(JoinPath);

    const allFiles = ChannelFileStorageService.listAllFiles(joinedRoot);
    for (const filePath of allFiles) {
      if (joinedLegitFiles.indexOf(filePath) < 0) {
        unlinkSync(filePath);
      }
    }

    ChannelFileStorageService.clearEmptyDirectories(joinedRoot);
  }

  /** Get all files' absolute path from a directory */
  private static listAllFiles(rootPath: string): string[] {
    // Read the whole directory
    const entries = readdirSync(rootPath).map((dir) =>
      Path.join(rootPath, dir),
    );

    // Get sub-files
    const subFiles = entries
      .filter((subPath) => statSync(subPath).isDirectory())
      .map((subPath) => ChannelFileStorageService.listAllFiles(subPath))
      .reduce(
        (flatten: string[], files: string[]) => flatten.concat(files),
        [],
      );

    // Return files and sub-files
    return entries
      .filter((subPath) => statSync(subPath).isFile())
      .concat(subFiles);
  }

  /** Delete all directories if empty */
  private static clearEmptyDirectories(rootPath: string): void {
    // Remove sub-directories
    readdirSync(rootPath)
      .map((dir) => Path.join(rootPath, dir))
      .filter((subPath) => statSync(subPath).isDirectory())
      .forEach((subPath) =>
        ChannelFileStorageService.clearEmptyDirectories(subPath),
      );

    // Count remaining files & dirs
    const count = readdirSync(rootPath).length;

    if (count === 0) {
      rmdirSync(rootPath);
    }
  }
}
