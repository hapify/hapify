import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITemplate } from '../../interfaces/template';
import { TemplateEngine } from '../../interfaces/template-engine.enum';
import { TemplateInput } from '../../interfaces/template-input.enum';

@Component({
  selector: 'app-channel-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent {
  /** Constructor */
  constructor() {}
  /** New template instance */
  @Input() template: ITemplate;
  /** Triggered when the path is changed */
  @Output() pathChanged = new EventEmitter<void>();
  /** Triggered when something is changed */
  @Output() changed = new EventEmitter<void>();
  /** Show editor */
  @Output() showEditor = new EventEmitter<void>();
  /** Available engines */
  engines: {
    value: string;
    name: string;
  }[] = [
    { name: 'Hapify', value: TemplateEngine.Hpf },
    { name: 'EJS', value: TemplateEngine.Ejs },
    { name: 'JavaScript', value: TemplateEngine.JavaScript },
  ];
  /** Available inputs */
  inputs: {
    value: string;
    name: string;
  }[] = [
    { name: 'template_input_one', value: TemplateInput.One },
    { name: 'template_input_all', value: TemplateInput.All },
  ];
  /** Called when the user click on "Open Editor" button */
  onShowEditor(): void {
    this.showEditor.emit();
  }
  /** Called when the user click on "Open Editor" button */
  onPathChange(value: string): void {
    this.template.path = value;
    this.pathChanged.emit();
  }
}
