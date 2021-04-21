import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IChannel } from '@app/channel/interfaces/channel';
import { StorageService as ChannelStorageService } from '@app/channel/services/storage.service';
import { IModel } from '@app/model/interfaces/model';
import { StorageService as ModelStorageService } from '@app/model/services/storage.service';
import { MessageService } from '@app/services/message.service';
import { Subscription } from 'rxjs';

import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'app-validator-details',
  templateUrl: './validator-details.component.html',
  styleUrls: ['./validator-details.component.scss'],
})
export class ValidatorDetailsComponent implements OnInit, OnDestroy {
  /** The channel storage service */
  protected channelStorageService: ChannelStorageService;

  /** The model storage service */
  protected modelStorageService: ModelStorageService;

  /** The validator service */
  protected validatorService: ValidatorService;

  /** The message service */
  protected messageService: MessageService;

  protected modelValue: IModel;

  protected models: IModel[];

  protected channelValue: IChannel;

  protected channels: IChannel[];

  /** Notify changes */
  protected signalSubscription: Subscription;

  /** Denotes if the process can be ran */
  protected initialized = false;

  /** Denotes if the process is already running */
  protected running = false;

  /** Errors & warnings details */
  details: string = null;

  /** Model getter */
  get model(): IModel {
    return this.modelValue;
  }

  @Input()
  set model(val: IModel) {
    this.modelValue = val;
    this.run().catch((error) => this.messageService.error(error));
  }

  get channel(): IChannel {
    return this.channelValue;
  }

  @Input()
  set channel(val: IChannel) {
    this.channelValue = val;
    this.run().catch((error) => this.messageService.error(error));
  }

  @Input()
  set signal(val: EventEmitter<void>) {
    // Unsubscribe previous
    if (this.signalSubscription) {
      this.signalSubscription.unsubscribe();
    }
    this.signalSubscription = val.subscribe(() => {
      this.run().catch((error) => this.messageService.error(error));
    });
  }

  /** Constructor */
  constructor(protected injector: Injector) {}

  /** On init */
  ngOnInit(): void {
    // Avoid circular dependency
    this.channelStorageService = this.injector.get(ChannelStorageService);
    this.modelStorageService = this.injector.get(ModelStorageService);
    this.validatorService = this.injector.get(ValidatorService);
    this.messageService = this.injector.get(MessageService);

    this.initialized = true;
    this.run().catch((error) => this.messageService.error(error));
  }

  /** Destroy */
  ngOnDestroy(): void {
    if (this.signalSubscription) {
      this.signalSubscription.unsubscribe();
    }
  }

  /** Returns the list of channels to deal with */
  protected async getChannels(): Promise<IChannel[]> {
    if (typeof this.channelValue !== 'undefined') {
      return [this.channelValue];
    }
    if (!this.channels) {
      this.channels = await this.channelStorageService.list();
    }
    return this.channels;
  }

  /** Returns the list of models to deal with */
  protected async getModels(): Promise<IModel[]> {
    if (typeof this.modelValue !== 'undefined') {
      return [this.modelValue];
    }
    if (!this.models) {
      this.models = await this.modelStorageService.list();
    }
    return this.models;
  }

  /** Run the process for Models x Channels */
  protected async run(): Promise<void> {
    // Check if possible
    if (!this.initialized || this.running) {
      return;
    }

    // Avoid echos
    this.running = true;

    // Start process
    try {
      await this.process(await this.getChannels(), await this.getModels());
    } catch (e) {
      this.running = false;
      throw e;
    }

    // Release
    this.running = false;
  }

  /** Sub-routine for run function */
  protected async process(
    channels: IChannel[],
    models: IModel[],
  ): Promise<void> {
    // Stop process on first error
    this.details = '';
    for (const channel of channels) {
      for (const model of models) {
        const { errors, warnings } = await this.validatorService.run(
          channel.validator,
          model,
        );
        // Ignore details
        if (errors.length === 0 && warnings.length === 0) {
          continue;
        }
        // Title
        this.details += `${channel.name} x ${model.name}:\n`;
        if (errors.length > 0) {
          this.details += `  ${errors.length} error${
            errors.length > 1 ? 's' : ''
          }\n`;
          this.details += `    ${errors.join('\n    ')}${
            errors.length ? '\n' : ''
          }\n`;
        }
        if (warnings.length > 0) {
          this.details += `  ${warnings.length} warning${
            warnings.length > 1 ? 's' : ''
          }\n`;
          this.details += `    ${warnings.join('\n    ')}${
            warnings.length ? '\n' : ''
          }\n`;
        }
      }
    }
    this.details = this.details.trim();

    // Null if empty
    if (this.details.length === 0) {
      this.details = null;
    }
  }
}
