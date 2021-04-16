import { VersionedObjectParser } from '../../../interface/Version';
import { IStorableCompactProject } from '../../../interface/Storage';

export class ProjectV2Parser implements VersionedObjectParser<IStorableCompactProject> {
	convert(input: IStorableCompactProject): IStorableCompactProject {
		return input;
	}
}
