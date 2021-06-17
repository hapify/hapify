import { IStorableCompactProject } from '../../../interface/Storage';
import { VersionedObjectParser } from '../../../interface/Version';

export class ProjectV3Parser
  implements VersionedObjectParser<IStorableCompactProject> {
  convert(input: IStorableCompactProject): IStorableCompactProject {
    return input;
  }
}
