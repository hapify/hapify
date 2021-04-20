import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AceEditorModule } from 'ng2-ace-editor';
import { TranslateModuleLoad } from '../translate-import';

import { ChannelComponent } from './components/channel/channel.component';
import { ChannelCardComponent } from './components/channel-card/channel-card.component';
import { TemplateComponent } from './components/template/template.component';
import { RootComponent } from './components/root/root.component';
import { EditComponent } from './components/edit/edit.component';
import { EditorComponent } from './components/editor/editor.component';
import { ValidatorEditorComponent } from '../validator/components/validator-editor/validator-editor.component';
// Services
import { StorageService } from './services/storage.service';
import { GeneratorService } from './services/generator.service';
import { HotkeyModule } from 'angular2-hotkeys';
// Directives
import { SharedModule } from '@app/shared/shared.module';
import { TreeComponent } from './components/tree/tree.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		AceEditorModule,
		TranslateModuleLoad(),
		TooltipModule.forRoot(),
		AlertModule.forRoot(),
		HotkeyModule,
		SharedModule,
	],
	declarations: [
		ChannelComponent,
		TemplateComponent,
		RootComponent,
		EditComponent,
		ChannelCardComponent,
		EditorComponent,
		ValidatorEditorComponent,
		TreeComponent,
	],
	providers: [StorageService, GeneratorService],
})
export class ChannelModule {}

export { CHANNEL_ROUTES } from './channel.routing';
export { Channel } from './classes/channel';
export { Template } from './classes/template';
export { IChannel, IChannelBase } from './interfaces/channel';
export { ITemplate, ITemplateBase } from './interfaces/template';
export { IGeneratorResult } from './interfaces/generator-result';
export { TemplateEngine } from './interfaces/template-engine.enum';
export { StorageService } from './services/storage.service';
export { GeneratorService } from './services/generator.service';
