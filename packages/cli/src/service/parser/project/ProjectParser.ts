import { IStorableCompactProject } from '../../../interface/Storage';
import { VersionScope } from '../../../interface/Version';
import { Parser } from '../Parser';
import { ProjectV1Parser } from './ProjectV1Parser';
import { ProjectV2Parser } from './ProjectV2Parser';
import {ProjectV3Parser} from "./ProjectV3Parser";

export class ProjectParser extends Parser<IStorableCompactProject> {
  protected getScope(): VersionScope {
    return 'project';
  }

  protected getWorkersMap() {
    return {
      '1': ProjectV1Parser,
      '2': ProjectV2Parser,
      '3': ProjectV3Parser,
    };
  }
}
