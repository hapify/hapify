import { Service } from 'typedi';

import { ProjectsCollection } from '../class/ProjectsCollection';

@Service()
export class ProjectsService {
  /** Returns the projects collection */
  async collection(): Promise<ProjectsCollection> {
    return ProjectsCollection.getInstance();
  }
}
