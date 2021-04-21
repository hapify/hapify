import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PresetMergeResults } from '@app/preset/interfaces/preset';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  readonly presetApplied = new Subject<PresetMergeResults>();
}
