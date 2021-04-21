import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FieldType } from '@app/model/classes/field-type';
import { ILabelledValue } from '@app/model/interfaces/labelled-value';

import { FieldLightComponent } from '../field-light/field-light.component';

@Component({
  selector: 'app-model-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent
  extends FieldLightComponent
  implements OnInit, OnDestroy {
  /** Rows deletion mode */
  @Input() deletionMode = false;

  /** Notify changes */
  @Output() update = new EventEmitter<void>();

  /** Request for delete field */
  @Output() delete = new EventEmitter<void>();

  isTypesTooltipDisplayed = false;

  displayedSubTypesTooltip: 'subtype' | 'entity' | 'enum' | null = null;

  isNotesTooltipDisplayed = false;

  fieldHovered = 'generic';

  isFieldsTooltipDisplayed = false;

  noSelectedField = false;

  readonly chipsListSeparatorKeysCodes: number[] = [ENTER, COMMA];

  ngOnInit(): void {
    super.ngOnInit();
    this.areSelectedFields();
  }

  /** Destroy */
  ngOnDestroy(): void {}

  /** Called when a value change */
  onInputChange(): void {
    this.updateField();
    this.update.emit();
  }

  /** Called when the user delete the field */
  onDelete(): void {
    this.delete.emit();
  }

  /** Update models properties from inputs values */
  private updateField(): void {
    this.updatePropertiesIcons();
    this.areSelectedFields();
  }

  /** Detect if at least one field attribute has been defined */
  private areSelectedFields(): void {
    this.noSelectedField = true;
    for (const pi of this.propertiesIcons) {
      if (this.field[pi.property]) {
        this.noSelectedField = false;
        break;
      }
    }
  }

  /** Display subtypes in tooltip */
  toggleSubtypesTooltip(): void {
    const hasSubTypes =
      this.field
        .getAvailableSubTypes()
        .filter((subType) => subType.value !== null).length > 0;

    const isEntity = this.field.type === FieldType.Entity;
    const isEnum = this.field.type === FieldType.Enum;

    if (isEnum) {
      this.displayedSubTypesTooltip = 'enum';
      this.subtypes = null;
    } else if (isEntity) {
      this.displayedSubTypesTooltip = 'entity';
      this.subtypes = this.field.getAvailableSubTypes();
    } else if (hasSubTypes) {
      this.displayedSubTypesTooltip = 'subtype';
      this.subtypes = this.field.getAvailableSubTypes();
    } else {
      this.displayedSubTypesTooltip = null;
      this.subtypes = null;
    }
  }

  toggleSubtypesTooltipIfSameValue(type: ILabelledValue): boolean {
    if (this.field.type === type.value) {
      this.toggleSubtypesTooltip();
      return false;
    }
    return true;
  }

  resetSubtypeAndTriggerInputChange(): void {
    this.field.subtype = null;
    this.field.value = null;
    this.onInputChange();
    this.toggleSubtypesTooltip();
  }

  addEnumToChipList({
    value,
    input,
  }: {
    value: string;
    input: HTMLInputElement;
  }): void {
    if (this.field.type === FieldType.Enum) {
      if (!Array.isArray(this.field.value)) {
        this.field.value = [];
      }
      this.field.value.push(value.trim());
      this.field.value = this.field.value.filter((v) => v.trim().length > 0);
      input.value = '';
      this.onInputChange();
    }
  }

  removeEnumFromChipList(value: string): void {
    if (this.field.type === FieldType.Enum) {
      this.field.value = (this.field.value as string[])
        .filter((v) => v !== value)
        .filter((v) => v.trim().length > 0);
      this.onInputChange();
    }
  }

  dropEnumInChipList(event: CdkDragDrop<string[]>): void {
    if (this.field.type === FieldType.Enum) {
      moveItemInArray(
        this.field.value as string[],
        event.previousIndex,
        event.currentIndex,
      );
      this.onInputChange();
    }
  }
}
