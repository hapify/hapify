import {DeepRequired} from "ts-essentials";
import { IApiModel } from '../../../interface/Api';
import {IV2ApiModel} from "../../../interface/legacy/v2/Api";
import { VersionedObjectParser } from '../../../interface/Version';

export class ApiModelV2Parser implements VersionedObjectParser<IApiModel> {
  convert(input: IV2ApiModel): DeepRequired<IApiModel> {
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
        value: f.value,
        properties: f.properties,
        notes: f.notes,
      })),
      accesses: input.accesses,
    };
  }
}
