import { Service } from 'typedi';

import { BoilerplatesCollection } from '../class/BoilerplatesCollection';

@Service()
export class BoilerplatesService {
  constructor() {}

  /** Returns the boilerplates collection */
  async collection(): Promise<BoilerplatesCollection> {
    return await BoilerplatesCollection.getInstance();
  }
}
