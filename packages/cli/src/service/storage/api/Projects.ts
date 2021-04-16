import { Service } from 'typedi';
import { BaseApiStorageService, BaseSearchParams } from './Base';
import { IProject } from '../../../interface/Objects';

interface ProjectsSearchParams extends BaseSearchParams {
	name?: string;
}
export interface IApiProject {
	_id: string;
	created_at: number;
	name: string;
	description?: string | null;
	owner: string | any;
}

@Service()
export class ProjectsApiStorageService extends BaseApiStorageService<IProject, IApiProject, ProjectsSearchParams> {
	protected defaultSearchParams(): any {
		const s = super.defaultSearchParams();
		s._limit = this.remoteConfig.projectsLimit;
		return s;
	}

	protected path(): string {
		return 'project';
	}

	protected fromApi(object: IApiProject): IProject {
		return {
			id: object._id,
			created_at: object.created_at,
			name: object.name,
			description: object.description,
		};
	}

	protected requiresAuthentication(): boolean {
		return true;
	}
}
