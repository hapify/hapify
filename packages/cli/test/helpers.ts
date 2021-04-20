import * as Os from 'os';
import * as Path from 'path';

import axios from 'axios';
import {
  copySync,
  ensureDirSync,
  existsSync,
  lstatSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import { Container } from 'typedi';
import WebSocket from 'ws';

import { Program } from '../src/class/Program';
import { IGlobalConfig } from '../src/interface/Config';
import { WebSocketMessage } from '../src/interface/WebSocket';
import { LoggerService } from '../src/service/Logger';

interface CliReturn {
  code: number;
  stdout: string;
  stderr: string;
}

export async function CLI(cmd: string, args: string[]): Promise<CliReturn> {
  // Clear context
  Container.reset();
  // Execute fake node command
  const logger = Container.get(LoggerService);
  await new Program()
    .run(['node', 'test.js', '--silent', cmd].concat(args))
    .catch((error) => {
      logger.handle(error);
    });
  const output = Container.get(LoggerService).getOutput();

  return {
    code: output.stderr.length ? 1 : 0,
    stdout: output.stdout,
    stderr: output.stderr,
  };
}

export async function Fetch<T = any>(
  url: string,
  params: any = null,
): Promise<T> {
  const response = await axios.get<T>(url, { params });
  if (response.status > 299) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return response.data;
}

interface WebSocketErrorPayload {
  message: string;
  data?: any;
}
export function SingleUseWebSocketClient<I, O>(
  url: string,
  data: WebSocketMessage<I>,
): Promise<O> {
  return new Promise((resolve, reject) => {
    const client = new WebSocket(url);
    client.on('open', () => {
      client.send(JSON.stringify(data));
    });
    client.on('message', (message: string) => {
      client.close();
      const decoded = JSON.parse(message) as WebSocketMessage<
        O | WebSocketErrorPayload
      >;
      if (decoded.id === 'error') {
        reject(
          new Error(
            (decoded as WebSocketMessage<WebSocketErrorPayload>).data.message,
          ),
        );
      } else {
        resolve((decoded as WebSocketMessage<O>).data);
      }
    });
    client.on('error', (error: Error) => {
      client.close();
      reject(error);
    });
  });
}

export const ProjectDir = Path.resolve(__dirname, '..');
export const SamplesDir = Path.resolve(ProjectDir, 'samples');
export const SampleHapiJSDir = Path.resolve(SamplesDir, 'hapijs');

export function GetFileContent(
  path: string,
  encoding: BufferEncoding = 'utf8',
): string {
  return readFileSync(Path.resolve(path), { encoding });
}
export function SetFileContent(
  path: string,
  content: string,
  encoding: BufferEncoding = 'utf8',
): void {
  writeFileSync(Path.resolve(path), content, { encoding });
}

export function GetJSONFileContent<T = unknown>(
  path: string,
  encoding: BufferEncoding = 'utf8',
): T {
  const content = GetFileContent(path, encoding);
  return JSON.parse(content);
}

export function GetJSONFileContentSafe<T = unknown>(
  path: string,
  defaultValue: T,
): T {
  try {
    const content = GetFileContent(path);
    return JSON.parse(content);
  } catch (e) {
    return defaultValue;
  }
}
export function GetGlobalConfig(): IGlobalConfig {
  return GetJSONFileContentSafe<IGlobalConfig>(
    `${Os.homedir()}/.hapify/config.json`,
    {},
  );
}

export class Sandbox {
  private readonly rootPath: string;

  constructor(private name: string = 'sandbox') {
    this.rootPath = Path.join(ProjectDir, 'test', name);
    this.create();
  }

  private create(): void {
    // Make dir if not exists
    ensureDirSync(this.rootPath);
  }

  clear(): void {
    removeSync(this.rootPath);
    this.create();
  }

  cloneFrom(
    path: string,
    filter: (src: string, dest: string) => boolean = () => true,
  ): void {
    const srcPath = Path.join(ProjectDir, path);
    copySync(srcPath, this.rootPath, {
      overwrite: true,
      recursive: true,
      filter,
    });
  }

  getPath(subPath: string[] = []): string {
    return Path.join(this.rootPath, ...subPath);
  }

  getFileContent(subPath: string[], encoding: BufferEncoding = 'utf8'): string {
    return GetFileContent(Path.join(this.rootPath, ...subPath), encoding);
  }

  setFileContent(
    subPath: string[],
    content: string,
    encoding: BufferEncoding = 'utf8',
  ): void {
    SetFileContent(Path.join(this.rootPath, ...subPath), content, encoding);
  }

  getJSONFileContent<T = unknown>(
    subPath: string[],
    encoding: BufferEncoding = 'utf8',
  ): T {
    return GetJSONFileContent<T>(
      Path.join(this.rootPath, ...subPath),
      encoding,
    );
  }

  fileExists(subPath: string[]): boolean {
    const path = Path.join(this.rootPath, ...subPath);
    return existsSync(path) && lstatSync(path).isFile();
  }

  dirExists(subPath: string[]): boolean {
    const path = Path.join(this.rootPath, ...subPath);
    return existsSync(path) && lstatSync(path).isDirectory();
  }

  touch(name = 'placeholder', content = ''): void {
    writeFileSync(Path.join(this.rootPath, name), content);
  }
}
