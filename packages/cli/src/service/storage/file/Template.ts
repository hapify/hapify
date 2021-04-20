import { Service } from 'typedi';

import { SingleSaveFileStorage } from './SingleSave';

@Service()
export class TemplatesFileStorageService extends SingleSaveFileStorage<string> {
  protected serialize(content: string): string {
    return content;
  }

  protected deserialize(content: string): string {
    return content;
  }
}
