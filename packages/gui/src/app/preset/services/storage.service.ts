import { Injectable } from '@angular/core';
import { StorageService as BaseStorageService } from '../../services/storage.service';
import { Preset } from '../classes/preset';
import { IPreset } from '../interfaces/preset';
import { WebSocketMessages } from '@app/interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService<IPreset> {
	protected instance(): IPreset {
		return new Preset();
	}
	protected getMessageId(): string {
		return WebSocketMessages.GET_PRESETS;
	}
	protected setMessageId(): string {
		return WebSocketMessages.NA;
	}
	list(): Promise<IPreset[]> {
		return super.list();
	}
	find(id: string): Promise<IPreset> {
		return super.find(id);
	}
	sort(instances: IPreset[]): void {
		instances.sort((a, b) => a.name.localeCompare(b.name));
	}
}
