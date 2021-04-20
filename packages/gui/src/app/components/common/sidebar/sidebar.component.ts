import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResizeService } from '@app/services/resize.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InfoService } from '@app/services/info.service';
import { IInfo } from '@app/interfaces/info';

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

	constructor(private resizeService: ResizeService, private infoService: InfoService) {}

	ngOnInit(): void {
		this.resizeService.breakpointChanges.pipe(takeUntil(this.unsubscribe)).subscribe((breakpointInfo) => {
			this.breakpoint = breakpointInfo.current;
		});
		this.infoService.info().then((info) => {
			this.info = info;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
	}
}
