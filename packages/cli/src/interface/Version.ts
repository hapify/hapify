type MODEL_VERSION = '3';
type PROJECT_VERSION = '3';
type CHANNEL_VERSION = '3';
type PRESET_VERSION = '3';

export type CurrentVersion<T> = T extends 'model'
  ? MODEL_VERSION
  : T extends 'project'
  ? PROJECT_VERSION
  : T extends 'channel'
  ? CHANNEL_VERSION
  : T extends 'preset'
  ? PRESET_VERSION
  : unknown;
export interface VersionScopes<T> {
  model: T;
  project: T;
  channel: T;
  preset: T;
}
export interface CurrentVersions extends VersionScopes<string> {
  model: CurrentVersion<'model'>;
  project: CurrentVersion<'project'>;
  channel: CurrentVersion<'channel'>;
  preset: CurrentVersion<'preset'>;
}
export type VersionScope = keyof CurrentVersions;

export interface VersionedObjectParser<O> {
  convert(input: VersionedObject): O;
}

export interface VersionedObject {
  /** The object's interface version */
  version: string;

  [key: string]: any;
}
