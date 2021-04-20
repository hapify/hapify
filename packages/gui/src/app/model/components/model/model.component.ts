import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Access } from '../../interfaces/access';
import { ILabelledValue } from '../../interfaces/labelled-value';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Field } from '@app/model/classes/field';
import { ModelLightComponent } from '../model-light/model-light.component';
import { IField } from '@app/model/interfaces/field';

interface IAccessValue {
	selected: boolean;
	value: ILabelledValue;
}
interface IActionValue {
	name: string;
	accesses: IAccessValue[];
}

/** Store accesses indexes */
const AccessesIndex = {
	[Access.ADMIN]: 0,
	[Access.OWNER]: 1,
	[Access.AUTHENTICATED]: 2,
	[Access.GUEST]: 3,
};
/** Store available accesses */
const Accesses: ILabelledValue[] = [
	{ name: 'Admin', value: Access.ADMIN },
	{ name: 'Owner', value: Access.OWNER },
	{ name: 'Auth.', value: Access.AUTHENTICATED },
	{ name: 'Guest', value: Access.GUEST },
];

@Component({
	selector: 'app-model-model',
	templateUrl: './model.component.html',
	styleUrls: ['./model.component.scss'],
})
export class ModelComponent extends ModelLightComponent implements OnInit, OnDestroy {
	/** Constructor */
	constructor(private hotKeysService: HotkeysService) {
		super();
	}

	/** Notify save */
	@Output() save = new EventEmitter<void>();
	/** Notify changes */
	@Output() update = new EventEmitter<void>();
	/** Notify cloning */
	@Output() clone = new EventEmitter<void>();
	/** Notify copy. Cannot be called copy, otherwise it will be called on Meta+C */
	@Output() copyModel = new EventEmitter<void>();
	/** Notify deletion */
	@Output() delete = new EventEmitter<void>();
	/** Hotkeys to unbind */
	private saveHotKeys: Hotkey | Hotkey[];
	/** List available actions */
	actions: IActionValue[] = [];
	public currentField: IField;

	accessRightsPanelIsDisplayed = false;
	notesPanelIsDisplayed = false;
	cleanRows = false;
	confirmModelDeletion = false;

	ngOnInit(): void {
		// Save on Ctrl+S
		this.saveHotKeys = this.hotKeysService.add(
			new Hotkey('meta+s', (): boolean => {
				this.save.emit();
				return false;
			})
		);
		// Get available actions
		this.updateActions();
	}

	togglePanel(panel: 'notes' | 'access'): void {
		this.accessRightsPanelIsDisplayed = panel === 'access' && !this.accessRightsPanelIsDisplayed;
		this.notesPanelIsDisplayed = panel === 'notes' && !this.notesPanelIsDisplayed;
	}

	/** Destroy */
	ngOnDestroy(): void {
		this.hotKeysService.remove(this.saveHotKeys);
	}

	/** Called when the user click on "add field" */
	addField(): void {
		this.model.addField(this.model.newField());
		this.onModelChange();
	}

	/** Called when the user click on "clean fields" */
	deleteField(field: Field): void {
		this.model.removeField(field);
		this.onModelChange();
	}

	/** Called when a field change */
	onModelChange(): void {
		this.updateActions();
		this.update.emit();
		// Auto-save
		this.save.emit();
	}

	/** Called when the user changes a access */
	onAccessChange(action: string, access: ILabelledValue): void {
		this.model.accesses[action] = access.value;
		this.onModelChange();
	}
	/** Denotes if the access should be highlighted */
	private isAccessSelected(action: string, access: ILabelledValue): boolean {
		return AccessesIndex[this.model.accesses[action]] >= AccessesIndex[access.value];
	}

	/** Compute actions selected actions for this model */
	private updateActions(): void {
		this.actions = Object.keys(this.model.accesses).map(
			(action: string): IActionValue => {
				return {
					name: action,
					accesses: Accesses.map((access) => ({
						selected: this.isAccessSelected(action, access),
						value: access,
					})),
				};
			}
		);
	}

	/** Drag and drop fields list */
	dropped(event: CdkDragDrop<string[]>): void {
		this.model.moveField(this.model.fields[event.previousIndex], event.currentIndex - event.previousIndex);
		this.onModelChange();
	}
}
