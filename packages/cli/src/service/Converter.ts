import { Service } from 'typedi';

import { IField } from '../interface/Generator';
import {
  CompactFieldBooleanProperty,
  IStorableCompactField,
} from '../interface/Storage';

@Service()
export class ConverterService {
  private booleanFieldPropertiesNames: CompactFieldBooleanProperty[] = [
    'primary',
    'unique',
    'label',
    'nullable',
    'multiple',
    'embedded',
    'searchable',
    'sortable',
    'hidden',
    'internal',
    'restricted',
    'ownership',
  ];

  convertFieldToCompactFormat(field: IField): IStorableCompactField {
    return {
      name: field.name,
      type: field.type,
      subtype: field.subtype || undefined,
      value: field.value || undefined,
      properties: this.convertBooleanPropertiesToCompactFormat(field),
      notes: field.notes || undefined,
    };
  }

  convertBooleanPropertiesToCompactFormat(
    field: { [key in CompactFieldBooleanProperty]: boolean },
  ): CompactFieldBooleanProperty[] {
    return this.booleanFieldPropertiesNames
      .map((property) => (field[property] ? property : null))
      .filter((p) => !!p);
  }

  convertFieldFromCompactFormat(field: IStorableCompactField): IField {
    return {
      name: field.name,
      type: field.type,
      subtype: field.subtype || null,
      value: field.value || null,
      primary: field.properties.includes('primary'),
      unique: field.properties.includes('unique'),
      label: field.properties.includes('label'),
      nullable: field.properties.includes('nullable'),
      multiple: field.properties.includes('multiple'),
      embedded: field.properties.includes('embedded'),
      searchable: field.properties.includes('searchable'),
      sortable: field.properties.includes('sortable'),
      hidden: field.properties.includes('hidden'),
      internal: field.properties.includes('internal'),
      restricted: field.properties.includes('restricted'),
      ownership: field.properties.includes('ownership'),
      notes: field.notes || null,
    };
  }
}
