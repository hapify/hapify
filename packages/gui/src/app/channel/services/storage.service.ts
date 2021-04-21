import { Injectable } from '@angular/core';

import { StorageService as BaseStorageService } from '../../services/storage.service';
import { Channel } from '../classes/channel';
import { IChannel } from '../interfaces/channel';

import { WebSocketMessages } from '@app/interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService<IChannel> {
  protected instance(): IChannel {
    return new Channel();
  }

  protected getMessageId(): string {
    return WebSocketMessages.GET_CHANNELS;
  }

  protected setMessageId(): string {
    return WebSocketMessages.SET_CHANNELS;
  }

  list(): Promise<IChannel[]> {
    return super.list();
  }

  find(id: string): Promise<IChannel> {
    return super.find(id);
  }

  sort(instances: IChannel[]): void {
    instances.sort((a, b) => a.name.localeCompare(b.name));
    for (const instance of instances) {
      instance.templates.sort((a, b) => a.path.localeCompare(b.path));
    }
  }
}
