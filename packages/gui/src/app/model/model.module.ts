import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModuleLoad } from '../translate-import';
import { ValidatorIconComponent } from '../validator/components/validator-icon/validator-icon.component';
import { ValidatorDetailsComponent } from '../validator/components/validator-details/validator-details.component';

import { ModelComponent } from './components/model/model.component';
import { FieldComponent } from './components/field/field.component';
import { NewComponent } from './components/new/new.component';
import { RootComponent } from './components/root/root.component';
import { ModelLightComponent } from './components/model-light/model-light.component';
import { FieldLightComponent } from './components/field-light/field-light.component';
import { HeaderComponent } from './components/header/header.component';
// Services
import { StorageService } from './services/storage.service';
import { SharedModule } from '@app/shared/shared.module';
import {
  PresetModule,
  RootComponent as PresetRootComponent,
} from '@app/preset/preset.module';
import { ModelService } from '@app/preset/services/model.service';
import { MessageService } from '@app/services/message.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModuleLoad(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    SharedModule,
    PresetModule,
  ],
  declarations: [
    ModelComponent,
    FieldComponent,
    ModelLightComponent,
    FieldLightComponent,
    NewComponent,
    RootComponent,
    ValidatorIconComponent,
    ValidatorDetailsComponent,
    HeaderComponent,
  ],
  providers: [StorageService, ModelService, MessageService],
  entryComponents: [PresetRootComponent],
})
export class ModelModule {}

export { MODEL_ROUTES } from './model.routing';
export { Model } from './classes/model';
export { Field } from './classes/field';
export { IModel, IModelBase } from './interfaces/model';
export { IField, IFieldBase } from './interfaces/field';
export { IAccesses, Access } from './interfaces/access';
export { StorageService } from './services/storage.service';
