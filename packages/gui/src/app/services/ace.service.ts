import { Injectable } from '@angular/core';
import { StringService } from './string.service';
import { ConfigService } from './config.service';

declare const ace: any;

@Injectable()
export class AceService {
  /** Map between file extension and ace mode */
  private modeMap: { [key: string]: string } = {
    js: 'javascript',
    ts: 'typescript',
    md: 'markdown',
  };

  /** Constructor */
  constructor(
    private stringService: StringService,
    private configService: ConfigService,
  ) {
    // Set base url for ace
    ace.config.set('basePath', this.configService.getAceBaseUri());
  }

  /** Returns the main theme */
  theme(): string {
    return this.configService.getAceTheme();
  }

  /**
   * Returns the mode for a path
   * Should parse path to extract extension (default: true)
   */
  mode(path: string, parse: boolean = true): string {
    const ext = parse ? this.stringService.extension(path) : path;
    if (ext && typeof this.modeMap[ext] === 'string') {
      return this.modeMap[ext];
    }
    return ext;
  }
}
