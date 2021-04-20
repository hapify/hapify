import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModuleLoad } from '../translate-import';

import { RootComponent } from './components/root/root.component';
// Services
import { StorageService } from './services/storage.service';
import { SharedModule } from '@app/shared/shared.module';
import { PresetCardComponent } from '@app/preset/components/preset-card/preset-card.component';
import { MessageService } from '@app/services/message.service';
import { WebSocketService } from '@app/services/websocket.service';
import { ModelService } from '@app/preset/services/model.service';

@NgModule({
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModuleLoad(), TooltipModule.forRoot(), AlertModule.forRoot(), SharedModule],
	declarations: [RootComponent, PresetCardComponent],
	providers: [StorageService, MessageService, WebSocketService, ModelService],
	exports: [RootComponent],
	entryComponents: [RootComponent],
})
export class PresetModule {}

export { Preset } from './classes/preset';
export { IPreset, IPresetBase } from './interfaces/preset';
export { StorageService } from './services/storage.service';
export { RootComponent } from './components/root/root.component';
