import { DeepRequired } from 'ts-essentials';
import { Container, Service } from 'typedi';

import { IRemoteConfig } from '../../../interface/Config';
import { IStorageService } from '../../../interface/Storage';
import { VersionedObject } from '../../../interface/Version';
import { ApiService } from '../../Api';
import { AuthenticatedApiService } from '../../AuthenticatedApi';
import { OptionsService } from '../../Options';

/** Used to export and import search params */
export interface BaseSearchParams {
  _page?: string | number;
  _limit?: string | number;
  _sort?: string;
  _order?: string;
  _id?: string[];
}
/** Response structures from the API */
interface ListResult<T> {
  page: number;
  limit: number;
  count: number;
  total: number;
  items: T[];
}
interface CountResult {
  total: number;
}

@Service()
/**
 * T: Internal interface
 * I: Api Interface
 * S: Search params
 */
export abstract class BaseApiStorageService<T, I, S extends BaseSearchParams>
  implements IStorageService<T> {
  /** Stores the remote config to use */
  protected remoteConfig: IRemoteConfig;

  /** Api service to use (authenticated or not) */
  private apiService: ApiService;

  constructor(private optionsService: OptionsService) {
    this.apiService = this.requiresAuthentication()
      ? Container.get(AuthenticatedApiService)
      : Container.get(ApiService);
    this.remoteConfig = optionsService.remoteConfig();
  }

  /** Create a new model */
  async create(payload: Partial<I>): Promise<T> {
    const output = (await this.apiService.post<I>(`${this.path()}`, payload))
      .data;
    return this.parsePayloadFromApi(output) as T;
  }

  /** Update an model selected from it's id */
  async update(id: string, payload: Partial<I>): Promise<void> {
    await this.apiService.patch<void>(`${this.path()}/${id}`, payload);
  }

  /** Get an model from it's id */
  async get(id: string): Promise<T> {
    const output = (await this.apiService.get<I>(`${this.path()}/${id}`)).data;
    return this.parsePayloadFromApi(output) as T;
  }

  /** Delete an model selected from it's id */
  async remove(id: string): Promise<void> {
    await this.apiService.delete<void>(`${this.path()}/${id}`);
  }

  /** Get list for model search */
  async list(searchParams?: S): Promise<T[]> {
    const mergedSearchParams = this.mergeSearchParams(searchParams);
    const output = (
      await this.apiService.get<ListResult<I>>(
        `${this.path()}`,
        mergedSearchParams,
      )
    ).data.items;
    return output.map((o) => this.parsePayloadFromApi(o) as T);
  }

  /** Count for model */
  async count(searchParams?: S): Promise<number> {
    // Remove unwanted properties
    const mergedSearchParams = this.mergeSearchParams(searchParams);
    delete mergedSearchParams._page;
    delete mergedSearchParams._limit;
    delete mergedSearchParams._order;
    delete mergedSearchParams._sort;
    return (
      await this.apiService.get<CountResult>(
        `${this.path()}/count`,
        mergedSearchParams,
      )
    ).data.total;
  }

  /** Get the default search params (limit, page, etc...) */
  protected defaultSearchParams(): S {
    return {
      _page: 0,
      _limit: 20,
    } as S;
  }

  /** Denotes if the calls to the API need the X-Api-Token header */
  protected abstract requiresAuthentication(): boolean;

  /** Returns the base URI for this model */
  protected abstract path(): string;

  /** Convert an old payload to new payload */
  protected parsePayloadFromApi(object: VersionedObject | I): DeepRequired<T> {
    if (typeof (object as VersionedObject).version !== 'undefined') {
      const converted = this.convertToCurrentVersion(object as VersionedObject);
      return this.fromApi(converted);
    }
    return this.fromApi(object as I);
  }

  /** Convert payload accordingly to version */
  protected convertToCurrentVersion(object: VersionedObject | I): I {
    return object as I;
  }

  /** Convert an incoming payload to an internal payload */
  protected abstract fromApi(object: I): DeepRequired<T>;

  /** Helper to merge search params */
  protected mergeSearchParams(searchParams?: S): S {
    return searchParams
      ? Object.assign(this.defaultSearchParams(), searchParams)
      : this.defaultSearchParams();
  }
}
