import { Injectable } from '@angular/core';
import { WebSocketMessages } from '@app/interfaces/websocket-message';
import { IModel } from '@app/model/interfaces/model';
import { WebSocketService } from '@app/services/websocket.service';
import * as md5 from 'md5';

import { IValidatorResult } from '../interfaces/validator-result';

@Injectable()
export class ValidatorService {
  /** Constructor */
  constructor(private webSocketService: WebSocketService) {}

  /** Cache stack */
  private cache: { [key: string]: IValidatorResult } = {};

  /** Processes locks */
  private locks: { [key: string]: boolean } = {};

  /** Delay before retry */
  private lockDelay = 50;

  /** Compute hash for for context */
  private static hash(script: string, model: IModel): string {
    const m = model.toObject();
    delete m.id;
    const modelHash = md5(JSON.stringify(m));
    const scriptHash = md5(script);
    return `${modelHash}-${scriptHash}`;
  }

  /** Run validation on a single model for a single channel */
  async run(script: string, model: IModel): Promise<IValidatorResult> {
    // No script, no error
    if (typeof script === 'undefined' || script.length === 0) {
      return {
        errors: [],
        warnings: [],
      };
    }

    // Get cache
    const hash = ValidatorService.hash(script, model);
    if (typeof this.cache[hash] !== 'undefined') {
      return this.cache[hash];
    }

    // If locked, wait few milliseconds and retry to hit the cache
    if (this.locks[hash]) {
      await new Promise((r) => setTimeout(r, this.lockDelay));
      return await this.run(script, model);
    }

    // Set the lock
    this.locks[hash] = true;

    const result = await this.webSocketService.send(
      WebSocketMessages.VALIDATE_MODEL,
      {
        model: model.toObject(),
        content: script,
      },
    );

    // Save cache
    this.cache[hash] = result;

    // Release the lock
    this.locks[hash] = false;

    return result;
  }
}
