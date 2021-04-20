import { Service } from 'typedi';

import {
  CurrentVersions,
  VersionScope,
  VersionScopes,
} from '../interface/Version';

@Service()
export class VersionService {
  private supportedVersions: VersionScopes<string[]> = {
    model: ['1', '2'],
    project: ['1', '2'],
    channel: ['1', '2'],
    preset: ['1', '2'],
  };

  private currentVersions: CurrentVersions = {
    model: '2',
    project: '2',
    channel: '2',
    preset: '2',
  };

  ensureVersionIsSupported(scope: VersionScope, version: string) {
    if (!this.supportedVersions[scope].includes(version)) {
      throw new Error(
        `Version ${version} of ${scope} is not supported. Supported versions are ${this.supportedVersions[
          scope
        ].join(', ')}. Please upgrade your CLI or ${scope}.`,
      );
    }
  }

  getCurrentVersion<T extends VersionScope>(scope: T): CurrentVersions[T] {
    return this.currentVersions[scope];
  }
}
