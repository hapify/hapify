import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeyModule } from 'angular2-hotkeys';
import { AceEditorModule } from 'ng2-ace-editor';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ChannelModule } from './channel/channel.module';
import { ChannelComponent } from './components/channel/channel.component';
import { DialogPremiumComponent } from './components/common/dialog-premium/dialog-premium.component';
import { HeaderComponent } from './components/common/header/header.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { ModelComponent } from './components/model/model.component';
import { ModelModule } from './model/model.module';
import { AceService } from './services/ace.service';
import { ConfigService } from './services/config.service';
import { StringService } from './services/string.service';
import { WebSocketService } from './services/websocket.service';
import { TranslateModuleLoad } from './translate-import';
import { ValidatorService } from './validator/services/validator.service';

import { InfoService } from '@app/services/info.service';
import { MessageService } from '@app/services/message.service';
import { SharedModule } from '@app/shared/shared.module';
// Components
// Services

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    AppComponent,
    ModelComponent,
    ChannelComponent,
    SidebarComponent,
    HeaderComponent,
    DialogPremiumComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    AceEditorModule,
    FormsModule,
    HotkeyModule.forRoot(),
    ChannelModule,
    ModelModule,
    SharedModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,
  ],
  providers: [
    ConfigService,
    StringService,
    AceService,
    ValidatorService,
    WebSocketService,
    MessageService,
    InfoService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogPremiumComponent],
})
export class AppModule {}
