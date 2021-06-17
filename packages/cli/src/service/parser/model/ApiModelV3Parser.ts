import { IApiModel } from '../../../interface/Api';
import { VersionedObjectParser } from '../../../interface/Version';

export class ApiModelV3Parser implements VersionedObjectParser<IApiModel> {
  convert(input: IApiModel): IApiModel {
    return input;
  }
}
