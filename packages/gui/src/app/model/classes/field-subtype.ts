import { ILabelledValue } from '../interfaces/labelled-value';

export class FieldSubType {
  static Boolean = {
    Default: null as string,
  };

  static Number = {
    Default: null as string,
    Integer: 'integer',
    Float: 'float',
    Latitude: 'latitude',
    Longitude: 'longitude',
  };

  static String = {
    Default: null as string,
    Email: 'email',
    Password: 'password',
    Url: 'url',
    Text: 'text',
    RichText: 'rich',
  };

  static DateTime = {
    Default: null as string,
    Date: 'date',
    Time: 'time',
  };

  static Entity = {
    Default: null as string,
    OneOne: 'oneOne',
    OneMany: 'oneMany',
    ManyOne: 'manyOne',
    ManyMany: 'manyMany',
  };

  static Enum = {
    Default: null as string,
  };

  static Object = {
    Default: null as string,
  };

  static File = {
    Default: null as string,
    Image: 'image',
    Video: 'video',
    Audio: 'audio',
    Document: 'document',
  };

  /** Get the list of sub types for boolean */
  static boolean(): ILabelledValue[] {
    return [{ name: 'Default', value: FieldSubType.Boolean.Default }];
  }

  /** Get the list of sub types for number */
  static number(): ILabelledValue[] {
    return [
      { name: 'Default', value: FieldSubType.Number.Default },
      { name: 'Integer', value: FieldSubType.Number.Integer },
      { name: 'Float', value: FieldSubType.Number.Float },
      { name: 'Latitude', value: FieldSubType.Number.Latitude },
      { name: 'Longitude', value: FieldSubType.Number.Longitude },
    ];
  }

  /** Get the list of sub types for string */
  static string(): ILabelledValue[] {
    return [
      { name: 'Default', value: FieldSubType.String.Default },
      { name: 'Email', value: FieldSubType.String.Email },
      { name: 'Password', value: FieldSubType.String.Password },
      { name: 'Url', value: FieldSubType.String.Url },
      { name: 'Text', value: FieldSubType.String.Text },
      { name: 'Rich Text', value: FieldSubType.String.RichText },
    ];
  }

  /** Get the list of sub types for datetime */
  static datetime(): ILabelledValue[] {
    return [
      { name: 'Default', value: FieldSubType.DateTime.Default },
      { name: 'Date', value: FieldSubType.DateTime.Date },
      { name: 'Time', value: FieldSubType.DateTime.Time },
    ];
  }

  /** Get the list of sub types for entity */
  static entity(): ILabelledValue[] {
    return [
      { name: 'Default', value: FieldSubType.Entity.Default },
      { name: '1:1', value: FieldSubType.Entity.OneOne },
      { name: '1:N', value: FieldSubType.Entity.OneMany },
      { name: 'N:1', value: FieldSubType.Entity.ManyOne },
      { name: 'N:N', value: FieldSubType.Entity.ManyMany },
    ];
  }

  /** Get the list of sub types for enum */
  static enum(): ILabelledValue[] {
    return [{ name: 'Default', value: FieldSubType.Enum.Default }];
  }

  /** Get the list of sub types for object */
  static object(): ILabelledValue[] {
    return [{ name: 'Default', value: FieldSubType.Object.Default }];
  }

  /** Get the list of sub types for file */
  static file(): ILabelledValue[] {
    return [
      { name: 'Default', value: FieldSubType.File.Default },
      { name: 'Image', value: FieldSubType.File.Image },
      { name: 'Video', value: FieldSubType.File.Video },
      { name: 'Audio', value: FieldSubType.File.Audio },
      { name: 'Document', value: FieldSubType.File.Document },
    ];
  }
}
