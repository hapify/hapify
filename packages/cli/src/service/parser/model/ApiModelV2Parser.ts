import { IApiModel } from '../../../interface/Api';
import { VersionedObjectParser } from '../../../interface/Version';

export class ApiModelV2Parser implements VersionedObjectParser<IApiModel> {
  convert(input: IApiModel): IApiModel {
    return input;
  }
}
