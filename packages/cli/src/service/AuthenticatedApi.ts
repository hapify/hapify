import { Service } from 'typedi';
import axios from 'axios';
import { ApiService } from './Api';

@Service()
export class AuthenticatedApiService extends ApiService {
	/** Create and get the http client */
	client() {
		if (!this.http) {
			this.http = axios.create({
				baseURL: this.optionsService.remoteConfig().uri,
				headers: {
					'X-Api-Key': this.optionsService.apiKey(),
				},
			});
		}
		return this.http;
	}
}
