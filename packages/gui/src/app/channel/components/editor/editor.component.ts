import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { AceEditorComponent } from 'ng2-ace-editor';

import {
  IModel,
  StorageService as ModelStorageService,
} from '../../../model/model.module';
import { IGeneratorResult } from '../../interfaces/generator-result';
import { ITemplate } from '../../interfaces/template';
import { GeneratorService } from '../../services/generator.service';

import { RichError } from '@app/class/RichError';
import { AceService } from '@app/services/ace.service';
import { MessageService } from '@app/services/message.service';

declare function confirm(message: string): void;

@Component({
  selector: 'app-channel-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  /** The generator service */
  generatorService: GeneratorService;

  /** The generator service */
  modelStorageService: ModelStorageService;

  /** Template to edit instance */
  @Input() template: ITemplate;

  /** On save event */
  @Output() save = new EventEmitter<ITemplate | null>();

  /** On close event */
  @Output() exit = new EventEmitter<void>();

  /** The edited template */
  wip: ITemplate;

  /** Preview models */
  models: IModel[];

  /** Preview model */
  model: IModel;

  /** Generation results */
  result: IGeneratorResult;

  /** Generation results for path only */
  pathResult: string;

  /** Generation error */
  error: string;

  /** Denotes if should re-generate preview on change */
  autoRefresh = true;

  /** Text display to prevent reloading */
  private beforeUnloadWarning: string;

  /** Denotes if the user has unsaved changes (to prevent reload) */
  unsavedChanges = false;

  /** Hotkeys to unbind */
  private saveHotKeys: Hotkey | Hotkey[];

  /** Error codes to display in editor */
  private handledCodes = [
    1003,
    1004,
    1005,
    2004,
    2005,
    6001,
    6002,
    6003,
    6004,
    7001,
  ];

  /** Left editor */
  @ViewChild('editorInput') editorInput: AceEditorComponent;

  /** Constructor */
  constructor(
    private injector: Injector,
    private translateService: TranslateService,
    private hotKeysService: HotkeysService,
    public aceService: AceService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
  ) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
    this.modelStorageService = this.injector.get(ModelStorageService);
  }

  /** On init */
  ngOnInit(): void {
    // Handle generation messages
    this.messageService.addErrorHandler({
      name: 'template-editor',
      handle: (error: Error) => this.handledError(error),
    });

    // Unloading message
    this.translateService.get('common_unload_warning').subscribe((value) => {
      this.beforeUnloadWarning = value;
    });

    // Save on Ctrl+S
    this.saveHotKeys = this.hotKeysService.add(
      new Hotkey('meta+s', (): boolean => {
        this.didClickSave();
        return false;
      }),
    );

    // Clone input template
    this.wip = this.template.clone();

    // Get all models
    this.modelStorageService
      .list()
      .then((models) => {
        this.models = models;
        if (this.wip.needsModel()) {
          [this.model] = this.models;
        }
        // Generate
        this.generate();
      })
      .catch((error) => this.messageService.error(error));
  }

  /** Destroy */
  ngOnDestroy(): void {
    this.hotKeysService.remove(this.saveHotKeys);
    this.messageService.removeErrorHandler('template-editor');
  }

  /**
   * After init
   * Bind Ctrl-S inside the editors
   */
  ngAfterViewInit(): void {
    this.editorInput
      .getEditor()
      .commands.addCommand(this.getEditorSaveCommand());
    this.cd.detectChanges();
  }

  /** Get the save command for the editors */
  private getEditorSaveCommand(): any {
    return {
      name: 'saveCommand',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Command-S',
        sender: 'editor|cli',
      },
      exec: () => {
        this.didClickSave();
      },
    };
  }

  /** Called when the user click on save */
  didClickSave(): void {
    this.template.content = this.wip.content;
    this.template.path = this.wip.path;
    this.unsavedChanges = false;
    this.save.emit(this.generatorService.autoSyncEnabled ? this.wip : null);
  }

  /** Called when the user click on close */
  didClickClose(): void {
    if (!this.unsavedChanges || confirm(this.beforeUnloadWarning)) {
      this.exit.emit();
    }
  }

  /** Runs the content generation */
  private generate(): void {
    // Clean results and error
    // Run generation
    this.generatorService
      .run(this.wip, this.model)
      .then((result) => {
        this.result = result;
        this.error = null;
        this.pathResult = result.path;
      })
      .catch((e) => {
        this.result = null;
        this.formatError(e);
      });
  }

  /** Runs the path generation */
  private generatePath(): void {
    // Run generation
    this.generatorService
      .path(this.wip, this.model)
      .then((result) => {
        this.pathResult = result;
      })
      .catch((e) => {
        this.formatError(e);
      });
  }

  /** Format an error to be displayed */
  private formatError(error: Error): void {
    if (this.handledError(error)) {
      this.error = (error as RichError).details();
    }
  }

  /** Format an error to be displayed */
  private handledError(error: Error): boolean {
    return (
      error instanceof RichError && this.handledCodes.includes(error.data.code)
    );
  }

  /** Call when the selected model is changed */
  onModelChange(): void {
    this.generate();
  }

  /** Call when the path is changed */
  onPathChange(value: string): void {
    this.wip.path = value;
    this.generatePath();
  }

  /** Call when the content is left */
  onBlur(content: string): void {
    this.wip.content = content;
    this.generate();
  }

  /** Call when the content changes */
  onChange(content: string): void {
    this.wip.content = content;
    this.unsavedChanges = true;
    if (this.autoRefresh) {
      this.generate();
    }
  }

  /** Call when the user click on "dump" */
  didClickDump(): void {
    // @todo Dump in popin
    this.messageService.info('To be implemented');
  }

  /** Prevent reloading */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any): string {
    if (!this.unsavedChanges) {
      return;
    }
    event.returnValue = this.beforeUnloadWarning;
    // Return a value for Safari
    // eslint-disable-next-line consistent-return
    return this.beforeUnloadWarning;
  }
}
