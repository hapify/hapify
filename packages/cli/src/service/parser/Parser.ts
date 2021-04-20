import { Container } from 'typedi';

import {
  VersionedObject,
  VersionedObjectParser,
  VersionScope,
} from '../../interface/Version';
import { VersionService } from '../Version';

export abstract class Parser<T> {
  private worker: VersionedObjectParser<T>;

  constructor(private input: VersionedObject) {
    Container.get(VersionService).ensureVersionIsSupported(
      this.getScope(),
      input.version,
    );
    this.initWorker();
  }

  private initWorker(): void {
    const workersMap = this.getWorkersMap();
    if (typeof workersMap[this.input.version] === 'undefined') {
      throw new Error(
        `Cannot find parser for ${this.getScope()} version ${
          this.input.version
        }`,
      );
    }
    this.worker = new workersMap[this.input.version]();
  }

  convert(): T {
    return this.worker.convert(this.input);
  }

  protected abstract getScope(): VersionScope;

  protected abstract getWorkersMap(): {
    [key: string]: new () => VersionedObjectParser<T>;
  };
}
