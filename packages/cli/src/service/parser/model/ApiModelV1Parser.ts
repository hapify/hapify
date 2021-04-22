import {DeepRequired} from "ts-essentials";
import { Container } from 'typedi';

import { IApiModel } from '../../../interface/Api';
import { IV1ApiModel } from '../../../interface/legacy/v1/Api';
import { VersionedObjectParser } from '../../../interface/Version';
import { ConverterService } from '../../Converter';

export class ApiModelV1Parser implements VersionedObjectParser<IApiModel> {
  private converterService: ConverterService;

  constructor() {
    this.converterService = Container.get(ConverterService);
  }

  convert(input: IV1ApiModel): DeepRequired<IApiModel> {
    return {
      version: '3',
      _id: input._id,
      created_at: input.created_at,
      updated_at: input.updated_at,
      owner: input.owner,
      project: input.project,
      name: input.name,
      notes: input.notes,
      fields: input.fields.map((f) => ({
        name: f.name,
        type: f.type,
        subtype: f.subtype,
        value: f.reference,
        properties: this.converterService.convertBooleanPropertiesToCompactFormat(
          f,
        ),
        notes: f.notes,
      })),
      accesses: input.accesses,
    };
  }
}
