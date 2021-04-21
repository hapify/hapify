import { Injectable } from '@angular/core';

import { environment } from '@env/environment';

declare const location: Location;

@Injectable()
export class ConfigService {
  /** Get the base path for ace */
  getAceBaseUri(): string {
    return environment.ace.baseUri;
  }

  /** Get the theme for ace */
  getAceTheme(): string {
    return environment.ace.theme;
  }

  /** Returns the ws info url */
  getWebSocketInfoUrl(): string {
    const uri = environment.cli.wsInfoUri;
    return uri.startsWith('http')
      ? uri
      : `${location.protocol}//${location.host}${uri}`;
  }
}
