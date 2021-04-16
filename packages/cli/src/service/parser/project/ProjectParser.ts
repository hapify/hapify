import { VersionScope } from '../../../interface/Version';
import { ProjectV1Parser } from './ProjectV1Parser';
import { ProjectV2Parser } from './ProjectV2Parser';
import { Parser } from '../Parser';
import { IStorableCompactProject } from '../../../interface/Storage';

export class ProjectParser extends Parser<IStorableCompactProject> {
	protected getScope(): VersionScope {
		return 'project';
	}
	protected getWorkersMap() {
		return {
			'1': ProjectV1Parser,
			'2': ProjectV2Parser,
		};
	}
}
