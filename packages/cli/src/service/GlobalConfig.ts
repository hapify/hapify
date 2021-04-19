import * as Os from 'os';
import * as Path from 'path';

import * as Fs from 'fs-extra';
import { Service } from 'typedi';


import { IGlobalConfig } from '../interface/Config';
import { GlobalConfigSchema } from '../interface/schema/Config';

@Service()
export class GlobalConfigService {
  /** Define the config root path */
  private rootPath = Path.resolve(Os.homedir(), '.hapify');

  /** The config file name */
  private filename = 'config.json';

  /** The config file path */
  private filePath = Path.join(this.rootPath, this.filename);

  /** Store the config data */
  private data: IGlobalConfig = {};

  constructor() {
    this.init();
  }

  /** Create file if not exists */
  private init(): void {
    // Create path
    if (
      !Fs.existsSync(this.rootPath) ||
      !Fs.statSync(this.rootPath).isDirectory()
    ) {
      Fs.ensureDirSync(this.rootPath);
    }
    // Create file
    if (!Fs.existsSync(this.filePath) || !Fs.statSync(this.filePath).isFile()) {
      this.save();
    }
    // Load & validate config
    this.load();
    this.validate();
  }

  /** Save data to config file */
  private save(): void {
    Fs.writeJSONSync(this.filePath, this.data, { spaces: 2 });
  }

  /** Load data from config file */
  private load(): void {
    this.data = Fs.readJSONSync(this.filePath);
  }

  /** Validate the current config or scream */
  private validate(data: IGlobalConfig = this.data): void {
    const validation = GlobalConfigSchema.validate(data);
    if (validation.error) {
      const errorMessage = validation.error.details
        .map((v) => {
          if (v.context.key === 'apiKey') {
            return `${v.message}. Please visit https://www.hapify.io/my-key`;
          }
          return v.message;
        })
        .join(', ');
      throw new Error(`Global config format error: ${errorMessage}.`);
    }
  }

  /** Returns the configs */
  getData(): IGlobalConfig {
    return this.data;
  }

  /** Validate and save the configs */
  setData(data: IGlobalConfig): void {
    this.validate(data);
    this.data = data;
    this.save();
  }
}
