import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IModel } from '@app/model/interfaces/model';
import { MessageService } from '@app/services/message.service';

import { IPreset } from '../../interfaces/preset';
import { StorageService } from '../../services/storage.service';

interface PresetMergeResults {
  created: IModel[];
  updated: IModel[];
}

@Component({
  selector: 'app-preset-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  @Output() presetApplied = new EventEmitter<PresetMergeResults>();

  /** Constructor */
  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
  ) {}

  /** Preset instances */
  public presets: IPreset[];

  ngOnInit(): void {
    this.updatePresets().catch((error) => this.messageService.error(error));
  }

  /** Update presets with storage */
  protected async updatePresets(): Promise<void> {
    this.presets = await this.storageService.list();
  }
}
