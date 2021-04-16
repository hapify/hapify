import { VersionedObjectParser } from '../../../interface/Version';
import { IApiModel } from '../../../interface/Api';

export class ApiModelV2Parser implements VersionedObjectParser<IApiModel> {
	convert(input: IApiModel): IApiModel {
		return input;
	}
}
