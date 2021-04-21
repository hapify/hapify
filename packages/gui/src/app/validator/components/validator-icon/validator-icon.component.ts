import { Component } from '@angular/core';
import { IModel } from '@app/model/interfaces/model';
import { IChannel } from '@app/channel/interfaces/channel';
import { ValidatorDetailsComponent } from '../validator-details/validator-details.component';

@Component({
  selector: 'app-validator-icon',
  templateUrl: './validator-icon.component.html',
  styleUrls: ['./validator-icon.component.scss'],
})
export class ValidatorIconComponent extends ValidatorDetailsComponent {
  /** Pre-computed error level */
  level = 'undefined';

  protected async process(
    channels: IChannel[],
    models: IModel[],
  ): Promise<void> {
    // Stop process on first error
    let hasError = false;
    let hasWarning = false;
    for (const channel of channels) {
      if (hasError) {
        break;
      }
      for (const model of models) {
        if (hasError) {
          break;
        }
        const result = await this.validatorService.run(
          channel.validator,
          model,
        );
        hasError = hasError || result.errors.length > 0;
        hasWarning = hasWarning || result.warnings.length > 0;
      }
    }

    if (hasError) {
      this.level = 'error';
    } else if (hasWarning) {
      this.level = 'warning';
    } else {
      this.level = 'valid';
    }
  }
}
