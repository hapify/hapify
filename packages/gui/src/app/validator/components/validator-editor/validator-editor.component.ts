import { AfterViewInit, Component, EventEmitter, HostListener, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IModel, StorageService as ModelStorageService } from '@app/model/model.module';
import { AceService } from '@app/services/ace.service';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { IValidatorResult } from '../../interfaces/validator-result';
import { ValidatorService } from '../../services/validator.service';
import { IChannel } from '@app/channel/interfaces/channel';
import { MessageService } from '@app/services/message.service';
import { RichError } from '@app/class/RichError';

@Component({
	selector: 'app-validator-editor',
	templateUrl: './validator-editor.component.html',
	styleUrls: ['./validator-editor.component.scss'],
})
export class ValidatorEditorComponent implements OnInit, OnDestroy, AfterViewInit {
	/** The model storage service */
	modelStorageService: ModelStorageService;
	/** The validator service */
	validatorService: ValidatorService;
	/** The calling channel */
	@Input() channel: IChannel;
	/** On save event */
	@Output() save = new EventEmitter<void>();
	/** On save event */
	@Output() exit = new EventEmitter<void>();
	/** The edited template */
	content: string;
	/** The content mode for ACE */
	aceMode = 'js';
	/** Models for auto-check */
	models: IModel[];
	/** Checked model */
	model: IModel;
	/** Validation result */
	result: IValidatorResult;
	/** Validation error */
	error: string;
	/** Result summary */
	summary = '';
	/** Denotes if should auto-check on change */
	autoValidate = true;
	/** Error codes to display in editor */
	private handledCodes = [4005, 4006, 4007];
	/** Text display to prevent reloading */
	private beforeUnloadWarning: string;
	/** Denotes if the user has unsaved changes (to prevent reload) */
	unsavedChanges = false;
	/** Hotkeys to unbind */
	private saveHotKeys: Hotkey | Hotkey[];
	/** Main editor */
	@ViewChild('editorInput') editorInput;

	/** Constructor */
	constructor(
		private injector: Injector,
		private translateService: TranslateService,
		private hotKeysService: HotkeysService,
		public aceService: AceService,
		private messageService: MessageService
	) {}

	/** On init */
	ngOnInit(): void {
		// Avoid circular dependency
		this.modelStorageService = this.injector.get(ModelStorageService);
		this.validatorService = this.injector.get(ValidatorService);

		// Handle generation messages
		this.messageService.addErrorHandler({
			name: 'validator-editor',
			handle: (error: Error) => this.handledError(error),
		});

		this.translateService.get('common_unload_warning').subscribe((value) => (this.beforeUnloadWarning = value));

		// Clone content
		this.content = this.channel.validator;

		// Save on Ctrl+S
		this.saveHotKeys = this.hotKeysService.add(
			new Hotkey('meta+s', (event: KeyboardEvent): boolean => {
				this.didClickSave();
				return false;
			})
		);

		// Get all models
		this.modelStorageService.list().then((models) => {
			this.models = models;
			this.model = this.models[0];
			// Re validate
			this.validate().catch((error) => this.messageService.error(error));
		});
	}

	/** Destroy */
	ngOnDestroy(): void {
		this.hotKeysService.remove(this.saveHotKeys);
		this.messageService.removeErrorHandler('validator-editor');
	}

	/**
	 * After init
	 * Bind Ctrl-S inside the editors
	 */
	ngAfterViewInit(): void {
		this.editorInput.getEditor().commands.addCommand(this.getEditorSaveCommand());
	}

	/** Format an error to be displayed */
	private handledError(error: Error): boolean {
		return error instanceof RichError && this.handledCodes.includes(error.data.code);
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
		this.channel.validator = this.content;
		this.unsavedChanges = false;
		this.save.emit();
	}

	/** Called when the user click on close */
	didClickClose(): void {
		this.exit.emit();
	}

	/** Runs the content generation */
	private async validate(): Promise<void> {
		// Clean error
		this.error = null;
		// Run validation
		try {
			this.result = await this.validatorService.run(this.content, this.model);

			const { errors, warnings } = this.result;

			this.summary = `${errors.length} error${errors.length > 1 ? 's' : ''}`;
			this.summary = `${this.summary}\n    ${errors.join('\n    ')}${errors.length ? '\n' : ''}`;
			this.summary = `${this.summary}\n${warnings.length} warning${warnings.length > 1 ? 's' : ''}`;
			this.summary = `${this.summary}\n    ${warnings.join('\n    ')}`;
		} catch (error) {
			if (error instanceof RichError) {
				this.error = error.details();
			} else {
				this.error = `${error.message}\n\n${error.stack}`;
			}
		}
	}

	/** Call when the selected model is changed */
	onModelChange(): void {
		this.validate().catch((error) => this.messageService.error(error));
	}

	/** Call when the content is left */
	onBlur(content: string): void {
		this.content = content;
		this.validate().catch((error) => this.messageService.error(error));
	}

	/** Call when the content changes */
	onChange(content: string): void {
		this.content = content;
		this.unsavedChanges = true;
		if (this.autoValidate) {
			this.validate().catch((error) => this.messageService.error(error));
		}
	}

	/** Call when the user click on "dump" */
	async didClickDump(): Promise<void> {
		this.messageService.log(this.model.toObject());
	}

	/** Prevent reloading */
	@HostListener('window:beforeunload', ['$event'])
	beforeUnloadHandler(event: any): string {
		if (!this.unsavedChanges) {
			return;
		}
		event.returnValue = this.beforeUnloadWarning;
		return this.beforeUnloadWarning;
	}
}
