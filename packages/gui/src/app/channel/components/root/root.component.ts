import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IChannel } from '../../interfaces/channel';
import { MessageService } from '@app/services/message.service';

@Component({
	selector: 'app-channel-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
	/** Channel instances */
	public channels: IChannel[] = [];
	/** Constructor */
	constructor(private storageService: StorageService, private messageService: MessageService) {}
	ngOnInit(): void {
		this.updateChannels().catch((error) => this.messageService.error(error));
	}
	/** Update channels with storage */
	protected async updateChannels(): Promise<void> {
		this.channels = await this.storageService.list();
	}
}
