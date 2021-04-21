import { Component, Input, OnInit } from '@angular/core';
import { ILabelledValue } from '@app/model/interfaces/labelled-value';

import { FieldType } from '../../classes/field-type';
import { IField } from '../../interfaces/field';
import { IModel } from '../../interfaces/model';

interface IPropertyIcon {
  property: string;
  icon: string;
  value: boolean;
}

@Component({
  selector: 'app-model-field-light',
  templateUrl: './field-light.component.html',
  styleUrls: ['../field/field.component.scss'],
})
export class FieldLightComponent implements OnInit {
  /** Constructor */
  constructor() {}

  /** Rows deletion mode */
  @Input() deletionMode = false;

  /** Available Models */
  @Input() models: IModel[];

  /** New field instance */
  @Input() field: IField;

  /** Link to FieldType class */
  fieldType = FieldType;

  /** Available types */
  types = this.fieldType.list();

  /** Available subtypes */
  subtypes: ILabelledValue[] = [];

  propertiesIcons: IPropertyIcon[] = [
    { property: 'primary', icon: 'vpn_key', value: false },
    { property: 'unique', icon: 'star', value: false },
    { property: 'label', icon: 'label', value: false },
    { property: 'nullable', icon: 'backspace', value: false },
    { property: 'multiple', icon: 'list', value: false },
    { property: 'embedded', icon: 'link', value: false },
    { property: 'searchable', icon: 'search', value: false },
    { property: 'sortable', icon: 'filter_list', value: false },
    { property: 'hidden', icon: 'visibility_off', value: false },
    { property: 'internal', icon: 'code', value: false },
    { property: 'restricted', icon: 'pan_tool', value: false },
    { property: 'ownership', icon: 'copyright', value: false },
  ];

  filteredPropertiesIcons: IPropertyIcon[] = [];

  ngOnInit(): void {
    this.updatePropertiesIcons();
    this.subtypes = this.field.getAvailableSubTypes();
  }

  /** Get the model name for an entity reference */
  getModelName(field: IField): string {
    if (field.type !== FieldType.Entity || !this.models) {
      return null;
    }
    const model = this.models.find((m) => m.id === field.value);
    return model ? model.name : '-';
  }

  /** Get the icon for the selected field */
  updatePropertiesIcons(): void {
    for (const p of this.propertiesIcons) {
      p.value = !!this.field[p.property];
    }
    this.filteredPropertiesIcons = this.propertiesIcons.filter((i) => i.value);
  }
}
