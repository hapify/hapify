import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '@app/services/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IInfo } from '@app/interfaces/info';
import { InfoService } from '@app/services/info.service';
import { ResizeService } from '@app/services/resize.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() reduced = false;

  unsubscribe = new Subject<void>();

  breakpoint = this.resizeService.currentBreakpoint;

  info: IInfo;

  constructor(
    private resizeService: ResizeService,
    private infoService: InfoService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.resizeService.breakpointChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((breakpointInfo) => {
        this.breakpoint = breakpointInfo.current;
      });
    this.infoService
      .info()
      .then((info) => {
        this.info = info;
      })
      .catch((error) => this.messageService.error(error));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}
