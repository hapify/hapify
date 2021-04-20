import * as Path from 'path';

import commander from 'commander';
import { Service } from 'typedi';

import { RemoteConfig } from '../config/Remote';
import { IRemoteConfig } from '../interface/Config';
import { GlobalConfigService } from './GlobalConfig';

@Service()
export class OptionsService {
  private program: commander.Command;

  private command: commander.Command;

  constructor(private globalConfigService: GlobalConfigService) {}

  /** Set program entity */
  setProgram(program: commander.Command): void {
    this.program = program;
  }

  /** Set command entity */
  setCommand(command: commander.Command): void {
    this.command = command;
  }

  /** Returns the remote config and override defaults with global config (if any) */
  remoteConfig(): IRemoteConfig {
    const configs = { ...RemoteConfig };
    configs.uri = this.apiUrl();
    return configs;
  }

  /** Return the working directory computed with the --dir option */
  dir(): string {
    if (this.program.dir) {
      if (Path.isAbsolute(this.program.dir)) {
        return this.program.dir;
      }
      return Path.resolve(process.cwd(), this.program.dir);
    }
    return process.cwd();
  }

  /** Return the API Key to use (explicit or global) */
  apiKey(): string {
    const key = this.program.key || this.globalConfigService.getData().apiKey;
    if (!key) {
      throw new Error(
        'Please define an API Key using command "hpf key" or the option "--key".\nTo get your api key, please visit https://www.hapify.io/my-key',
      );
    }
    return key;
  }

  /** Return the API URL to use or default URL */
  apiUrl(): string {
    const url = this.globalConfigService.getData().apiUrl;
    return url || RemoteConfig.uri;
  }

  /** Denotes if the debug mode is enabled */
  debug(): boolean {
    return !!this.program.debug;
  }

  /** Denotes if the silent mode is enabled */
  silent(): boolean {
    return !!this.program.silent;
  }

  /** Get the depth for recursive search */
  depth(): number {
    return Number(this.command.depth);
  }

  /** Get the output file path */
  output(): string {
    return this.command.output;
  }

  /** Get the required http port */
  port(): number {
    return Number(this.command.port);
  }

  /** Get the required http hostname */
  hostname(): string {
    return this.command.hostname;
  }

  /** Denotes if a new tab should be opened */
  open(): boolean {
    return this.command.open !== false;
  }
}
