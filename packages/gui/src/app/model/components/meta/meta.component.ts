import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MetaEntry } from '@app/model/interfaces/meta';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  skip,
  startWith,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss'],
})
export class MetaComponent implements OnInit, OnDestroy {
  /** Notify changes */
  @Output() update = new EventEmitter<Record<string, string>>();

  entries: MetaEntry[] = [];

  private updateMeta$ = new Subject<void>();

  private unsubscribe$ = new Subject<void>();

  @Input() meta: Record<string, string>;

  ngOnInit() {
    this.entries = this.getEntriesFromMeta();
    if (this.entries.length === 0) {
      this.addEntry();
    }

    this.updateMeta$
      .pipe(
        map(() => this.getMetaFromEntries()),
        startWith(this.getMetaFromEntries()),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        skip(1),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((meta) => {
        this.update.emit(meta);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addEntry() {
    this.entries.push({
      key: '',
      value: '',
    });
  }

  private getMetaFromEntries(): Record<string, string> {
    return this.entries.reduce((acc, entry) => {
      if (!!entry.key && !!entry.value) {
        acc[entry.key] = entry.value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  private getEntriesFromMeta(): MetaEntry[] {
    return Object.entries(this.meta || {}).map(([key, value]) => ({
      key,
      value,
    }));
  }

  onChange() {
    this.updateMeta$.next();
  }

  onDelete(entry: MetaEntry) {
    const index = this.entries.indexOf(entry);
    if (index > -1) {
      this.entries.splice(index, 1);
    }
    this.onChange();
  }
}
