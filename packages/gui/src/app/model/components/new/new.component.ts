import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Model } from '../../classes/model';
import { IModel, IModelBase } from '../../interfaces/model';
import { WebSocketService } from '@app/services/websocket.service';
import { WebSocketMessages } from '@app/interfaces/websocket-message';

@Component({
  selector: 'app-model-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements AfterViewInit {
  /** Constructor */
  constructor(private webSocketService: WebSocketService) {}

  public name = '';

  /** Notify save */
  @Output() create = new EventEmitter<IModel>();

  @ViewChild('nameInput') nameInput: ElementRef;

  ngAfterViewInit(): void {
    // Avoid "Expression has changed after it was checked" error
    setTimeout(() => this.nameInput.nativeElement.focus());
  }

  /** Called when the user save the new model */
  async save(): Promise<void> {
    // Get model from CLI
    const modelObject = (await this.webSocketService.send(
      WebSocketMessages.NEW_MODEL,
      {
        name: this.name,
      },
    )) as IModelBase;

    // Create new model
    const model = new Model();
    model.fromObject(modelObject);

    // Send the model
    this.create.emit(model);
  }
}
