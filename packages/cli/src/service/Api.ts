import querystring from 'querystring';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Service } from 'typedi';

import { RichAxiosError } from '../class/RichAxiosError';
import { OptionsService } from './Options';

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
