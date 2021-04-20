import { Service } from 'typedi';

import { BoilerplatesCollection } from '../class/BoilerplatesCollection';

@Service()
export class BoilerplatesService {
  /** Returns the boilerplates collection */
  async collection(): Promise<BoilerplatesCollection> {
    return BoilerplatesCollection.getInstance();
  }
}
