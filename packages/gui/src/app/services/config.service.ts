import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class ConfigService {
	constructor() {}

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
		const uri = environment.cli.wsInfoUri as string;
		return uri.startsWith('http') ? uri : `${location.protocol}//${location.host}${uri}`;
	}
}
