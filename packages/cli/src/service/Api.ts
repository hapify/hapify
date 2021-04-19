import querystring from 'querystring';

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Service } from 'typedi';

import { OptionsService } from './Options';

type ErrorData = { [k: string]: any };
export class RichAxiosError implements AxiosError {
  name: string;

  message: string;

  stack?: string;

  config: AxiosRequestConfig;

  code?: string;

  request?: any;

  response?: AxiosResponse;

  data?: ErrorData;

  constructor(error: AxiosError) {
    this.name = 'RichAxiosError';
    this.stack = error.stack;
    this.config = error.config;
    this.code = error.code;
    this.request = error.request;
    this.response = error.response;
    // Get message and payload if possible
    if (error.response && error.response.data) {
      this.message = error.response.data.message;
      this.data = error.response.data.data;
    } else {
      this.message = error.message;
    }
  }

  isAxiosError = true;

  toJSON: () => object = () => ({
      // Standard
      message: this.message,
      name: this.name,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
    });
}

@Service()
export class ApiService {
  /** Http client */
  protected http: AxiosInstance;

  constructor(protected optionsService: OptionsService) {}

  /** Create and get the http client */
  client() {
    if (!this.http) {
      this.http = axios.create({
        baseURL: this.optionsService.remoteConfig().uri,
      });
    }
    return this.http;
  }

  /** Get */
  async get<T>(
    url: string,
    query?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client().get<T>(this.query(url, query), config);
    } catch (e) {
      throw new RichAxiosError(e);
    }
  }

  /** Post */
  async post<T>(
    url: string,
    payload?: any,
    query?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client().post<T>(
        this.query(url, query),
        payload,
        config,
      );
    } catch (e) {
      throw new RichAxiosError(e);
    }
  }

  /** Patch */
  async patch<T>(
    url: string,
    payload?: any,
    query?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client().patch<T>(
        this.query(url, query),
        payload,
        config,
      );
    } catch (e) {
      throw new RichAxiosError(e);
    }
  }

  /** Delete */
  async delete<T>(
    url: string,
    query?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client().delete<T>(this.query(url, query), config);
    } catch (e) {
      throw new RichAxiosError(e);
    }
  }

  /** Helper to return a stringified query */
  protected query(url: string, object?: any): string {
    return object ? `${url}?${querystring.stringify(object)}` : url;
  }
}
