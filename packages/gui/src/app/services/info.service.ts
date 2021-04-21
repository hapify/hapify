import { Injectable } from '@angular/core';
import { Lock } from '@app/class/Lock';
import { IInfo } from '@app/interfaces/info';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { WebSocketService } from '@app/services/websocket.service';

@Injectable()
export class InfoService extends Lock {
  /** Stores the infos */
  private infoValue: IInfo;

  /** Constructor */
  constructor(private webSocketService: WebSocketService) {
    super();
  }

  /** Get info once and store them */
  async info(): Promise<IInfo> {
    await this.wait('info');
    if (!this.infoValue) {
      this.lock('info');
      this.infoValue = await this.webSocketService.send(
        WebSocketMessages.GET_INFO,
      );
      this.unlock('info');
    }
    return this.infoValue;
  }
}
