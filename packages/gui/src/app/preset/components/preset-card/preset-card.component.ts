import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IPreset } from '../../interfaces/preset';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { IModel } from '@app/model/interfaces/model';
import { ModelService } from '@app/preset/services/model.service';
import { WebSocketService } from '@app/services/websocket.service';

interface PresetMergeResults {
	created: IModel[];
	updated: IModel[];
}

@Component({
	selector: 'app-preset-preset-card',
	templateUrl: './preset-card.component.html',
	styleUrls: ['./preset-card.component.scss'],
})
export class PresetCardComponent implements OnInit {
	/** Constructor */
	constructor(private renderer: Renderer2, private modelService: ModelService, private webSocketService: WebSocketService) {}

	/** Preset instance */
	@Input() preset: IPreset;

	@ViewChild('description') description: ElementRef;

	confirmLoading = false;

	diffPreset: PresetMergeResults;

	ngOnInit(): void {}

	async previewDiffPresetApllied(): Promise<void> {
		this.diffPreset = (await this.webSocketService.send(WebSocketMessages.APPLY_PRESETS, {
			models: this.preset.models,
		})) as PresetMergeResults;
	}

	/** Called when the user click on "apply" */
	async applyDiffPreset(): Promise<void> {
		this.modelService.presetApplied.next(this.diffPreset);
	}

	mouseOver(event: MouseEvent): void {
		this.renderer.removeClass(this.description.nativeElement, 'd-none');
		this.renderer.addClass(this.description.nativeElement, 'd-block');
		this.renderer.setStyle(this.description.nativeElement, 'top', event.clientY + 20 + 'px');
		this.renderer.setStyle(this.description.nativeElement, 'left', event.clientX + 20 + 'px');
	}

	@HostListener('mouseleave', ['$event'])
	mouseLeave(): void {
		this.renderer.removeClass(this.description.nativeElement, 'd-block');
		this.renderer.addClass(this.description.nativeElement, 'd-none');
	}
}
