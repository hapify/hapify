import { Component, Output, Input, EventEmitter } from '@angular/core';
import {MetaEntry} from "@app/model/interfaces/meta";

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent {

  /** Notify changes */
  @Output() update = new EventEmitter<void>();

  private metaValue: Record<string, string>;

  entries: MetaEntry[] = [];

  @Input()
  set meta(meta: Record<string, string>) {
    this.metaValue = meta;
    this.entries = Object.entries(this.metaValue || {})
      .map(([key, value]) => ({ key, value }));
  }

  addMeta() {
    this.entries.push({
      key: '',
      value: ''
    });
  }

  onChange() {
    this.update.emit();
  }

  onDelete(entry: MetaEntry) {
    const index = this.entries.indexOf(entry);
    if (index > -1) {
      this.entries.splice(index, 1);
    }
    this.update.emit();
  }
}
