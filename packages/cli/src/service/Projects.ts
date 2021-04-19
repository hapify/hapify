import { Service } from 'typedi';

import { ProjectsCollection } from '../class/ProjectsCollection';

@Service()
export class ProjectsService {
  constructor() {}

  /** Returns the projects collection */
  async collection(): Promise<ProjectsCollection> {
    return await ProjectsCollection.getInstance();
  }
}
