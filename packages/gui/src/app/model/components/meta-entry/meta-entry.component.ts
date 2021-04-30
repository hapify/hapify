import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-meta-entry',
  templateUrl: './meta-entry.component.html',
  styleUrls: ['./meta-entry.component.scss']
})
export class MetaEntryComponent implements OnInit {

  /** Key of the row */
  @Input() meta: { key: string, value: string };

  /** Notify changes */
  @Output() update = new EventEmitter<void>();

  /** Request for delete field */
  @Output() delete = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onChange() {
    this.update.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
