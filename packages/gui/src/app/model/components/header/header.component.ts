import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IModel } from '@app/model/interfaces/model';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { RootComponent as PresetRootComponent } from '@app/preset/preset.module';
import { ModelService } from '@app/preset/services/model.service';
import { Model } from '@app/model/classes/model';
import { MessageService } from '@app/services/message.service';
import { StorageService } from '@app/model/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  addingNewModel = false;
  @Output() newModel = new EventEmitter<IModel>();
  @Output() newImport = new EventEmitter<void>();
  @Input() newModelDisabled = false;
  dialogSubscription: Subscription;
  modelServiceSubscription: Subscription;
  constructor(
    private dialog: MatDialog,
    private modelService: ModelService,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {}

  openPresetDialog(): void {
    this.dialog.open(PresetRootComponent, {
      panelClass: 'wideDialog',
    });

    this.modelServiceSubscription = this.modelService.presetApplied.subscribe(
      (results) => {
        this.updateModel(results).catch((error) =>
          this.messageService.error(error),
        );
      },
    );

    this.dialogSubscription = this.dialog.afterAllClosed.subscribe(() => {
      this.dialogSubscription.unsubscribe();
      this.modelServiceSubscription.unsubscribe();
    });
  }

  private async updateModel(results): Promise<void> {
    // @todo Require validation from user
    await this.storageService.update(
      results.updated.map((m) => {
        const model = new Model();
        model.fromObject(m);
        return model;
      }),
    );
    await this.storageService.add(
      results.created.map((m) => {
        const model = new Model();
        model.fromObject(m);
        return model;
      }),
    );

    // Show message to user...
    let message = results.created.length
      ? `Did create model(s) ${results.created.map((m) => m.name).join(', ')}`
      : 'No model created';
    message += '. ';
    message += results.updated.length
      ? `Did update model(s) ${results.updated.map((m) => m.name).join(', ')}`
      : 'No model updated';
    this.messageService.info(message);

    this.newImport.emit();
  }
}
