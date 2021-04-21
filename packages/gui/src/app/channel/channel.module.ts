import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotkeyModule } from 'angular2-hotkeys';
import { AceEditorModule } from 'ng2-ace-editor';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TranslateModuleLoad } from '../translate-import';
import { ValidatorEditorComponent } from '../validator/components/validator-editor/validator-editor.component';
import { ChannelCardComponent } from './components/channel-card/channel-card.component';
import { ChannelComponent } from './components/channel/channel.component';
import { EditComponent } from './components/edit/edit.component';
import { EditorComponent } from './components/editor/editor.component';
import { RootComponent } from './components/root/root.component';
import { TemplateComponent } from './components/template/template.component';
// Services
import { TreeComponent } from './components/tree/tree.component';
import { GeneratorService } from './services/generator.service';
import { StorageService } from './services/storage.service';

import { SharedModule } from '@app/shared/shared.module';
// Directives

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
