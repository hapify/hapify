import { Injectable } from '@angular/core';
import { StorageService as BaseStorageService } from '../../services/storage.service';
import { Model } from '../classes/model';
import { IModel } from '../interfaces/model';
import { WebSocketMessages } from '@app/interfaces/websocket-message';

@Injectable()
export class StorageService extends BaseStorageService<IModel> {
	protected instance(): IModel {
		return new Model();
	}
	protected getMessageId(): string {
		return WebSocketMessages.GET_MODELS;
	}
	protected setMessageId(): string {
		return WebSocketMessages.SET_MODELS;
	}
	list(): Promise<IModel[]> {
		return super.list();
	}
	find(id: string): Promise<IModel> {
		return super.find(id);
	}
	sort(instances: IModel[]): void {
		instances.sort((a, b) => a.name.localeCompare(b.name));
	}
}
