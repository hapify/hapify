import { Service } from 'typedi';

import { IBoilerplate } from '../../../interface/Objects';
import { BaseApiStorageService, BaseSearchParams } from './Base';

interface BoilerplatesSearchParams extends BaseSearchParams {
  premium?: string | boolean;
  name?: string;
  slug?: string;
  type?: string;
  technologies?: string[];
  features?: string[];
}
export interface IApiBoilerplate {
  _id?: string;
  created_at?: number | Date;
  owner?: string | any;
  premium?: boolean;
  name?: string;
  name__fr?: string | null;
  slug?: string;
  short_description?: string | null;
  short_description__fr?: string | null;
  logo?: string | any | null;
  description?: string | null;
  description__fr?: string | null;
  price?: string | null;
  git_url?: string | null;
  contact_url?: string | null;
  more_url?: string | null;
  type?: string | any | null;
  technologies?: string[] | any[];
  features?: string[] | any[];
}

@Service()
export class BoilerplatesApiStorageService extends BaseApiStorageService<
  IBoilerplate,
  IApiBoilerplate,
  BoilerplatesSearchParams
> {
  protected defaultSearchParams(): any {
    const s = super.defaultSearchParams();
    s._limit = this.remoteConfig.boilerplatesLimit;
    return s;
  }

  protected path(): string {
    return 'boilerplate';
  }

  protected fromApi(object: IApiBoilerplate): IBoilerplate {
    return {
      id: object._id,
      slug: object.slug,
      name: object.name,
      git_url: object.git_url,
    };
  }

  protected requiresAuthentication(): boolean {
    return false;
  }
}
