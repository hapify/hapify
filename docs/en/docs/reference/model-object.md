This document describes the structure of the object that represents a data model when writing a template.

Before reading this document, you should take a look at the [concepts section](../getting-started/concepts/models.md).

### Within the templates

### Injecting the data model

The template input can be defined as `one model` or `all models`.
During generation, if it is defined as `one model`, the template will be called once for each data model. Therefore, it will generate one file for each data model.
If it is defined as `all models`, the template will be called once for all data models. It will then generate a single file.

#### Single model

If the template requires only one model, then an object `model` ( alias `m`) will be available as a global variable in the template.
In a Hapify template, it will be available as `Model`, `M` or `root`.
In an EJS or JavaScript template, it will be available as `model` or `m`.

#### Multiple models

If the template requires all models, an array `models` ( alias `m`) will be available as a global variable in the template.
This array contains all available models.
In a Hapify template, it will be available as `Models`, `M` or `root`.
In an EJS or JavaScript template, it will be available as `models` or `m`.

### Structure of the model object

The following objects will be available in the template.

#### Model object

-   `id` (string): an unique ID
-   `name` (string): name of the model, as the user entered it.
-   `names` (object): name variants computed from the `name` property.
    -   `raw` (string): as the user entered it. Example `Online item`.
    -   `kebab` (string): example `online-item`.
    -   `big` (string): example `ONLINE-ITEM`.
    -   `header` (string): example `Online-Item`.
    -   `snake` (string): example `online_item`.
    -   `constant` (string): example `ONLINE_ITEM`.
    -   `compact` (string): example `onlineitem`.
    -   `camel` (string): example `onlineItem`.
    -   `pascal` (string): example `OnlineItem`.
    -   `lower` (string): example `online item`.
    -   `capital` (string): example `Online Item`.
-   `notes` (string): the notes of the model, as entered by the user.
-   `hasNotes` (boolean): the model has notes.
-   `fields` - alias `f` (object): an object containing all fields, grouped in different arrays. See *Field object* section to learn more about field's structure.
    -   `list` - alias `l` (array): containing all fields of the model.
    -   `primary` - alias `pr` (Field): primary field of the model. `null` if no primary field is defined.
    -   `unique` - alias `un` (array): fields flagged as `unique`.
    -   `label` - alias `lb` (array): fields flagged as `label`.
    -   `nullable` - alias `nu` (array): fields flagged as `nullable`.
    -   `multiple` - alias `ml` (array): fields flagged as `multiple`.
    -   `embedded` - alias `em` (array): fields flagged as `embedded`.
    -   `searchable` - alias `se` (array): fields flagged as `searchable`.
    -   `sortable` - alias `so` (array): fields flagged as `sortable`.
    -   `hidden` - alias `hd` (array): fields flagged as `hidden`.
    -   `internal` - alias `in` (array): fields flagged as `internal`.
    -   `restricted` - alias `rs` (array): fields flagged as `restricted`.
    -   `ownership` - alias `os` (array): fields flagged as `ownership`.
    -   `searchableLabel` - alias `sl` (array): fields flagged as `label` and `searchable`. Useful for quick-search by label.
    -   `filter` - alias `f` (Function): filter fields with a custom rule. Equivalent of `model.fields.list.filter`.
    -   `references` - alias `r` - non-deep model only (array): fields of type `entity`.
        -   `filter` - alias `f` (function): filter the array.
-   `dependencies` - alias `d` - non-deep model only (object): dependencies (to other models) of this model. A model has a dependency if one of this field is of type `entity`.
    -   `list` - alias `l` (array): dependency models, but self. These models are added as "deep models".
    -   `self` - alias `s` (boolean): this model has a self-dependency.
    -   `filter` - alias `f` (function): filter dependencies.
        -   First argument (function - default `(f) => f`): filter function receiving the referencer field (the entity field).
        -   Second argument (boolean - default `true`): boolean indicating if we should filter the self dependency.
-   `referencedIn` - alias `ri` - non-deep model only (array): models that refer to this one. These models are added as "deep models". These models only contains fields of type `entity` referring to the current model.
    -   `filter` - alias `f` (function): filter the array.
-   `properties` - alias `p` (object): pre-computed properties from fields.
    -   `fieldsCount` (number): the number of fields contained in the model.
    -   `hasPrimary` (boolean): model has a primary field.
    -   `hasUnique` (boolean): model has at least one unique field.
    -   `hasLabel` (boolean): model has at least one label field.
    -   `hasNullable` (boolean): model has at least one nullable field.
    -   `hasMultiple` (boolean): model has at least one multiple field.
    -   `hasEmbedded` (boolean): model has at least one embedded field.
    -   `hasSearchable` (boolean): model has at least one searchable field.
    -   `hasSortable` (boolean): model has at least one sortable field.
    -   `hasHidden` (boolean): model has at least one hidden field.
    -   `hasInternal` (boolean): model has at least one internal field.
    -   `hasRestricted` (boolean): model has at least one restricted field.
    -   `hasOwnership` (boolean): model has at least one ownership field.
    -   `hasSearchableLabel` (boolean): model has at least one field marked as label and also searchable.
    -   `hasDependencies` - non-deep model only (boolean): model has dependencies to other models or itself (through an `entity` field).
    -   `isReferenced` - non-deep model only (boolean): model is referenced by other models.
    -   `mainlyHidden` (boolean): most of the fields are hidden (strictly).
    -   `mainlyInternal` (boolean): most of the fields are internal (strictly).
    -   `isGeolocated` (boolean): model contains at least one latitude field and one longitude field.
    -   `isGeoSearchable` (boolean): model contains at least one searchable latitude field and one searchable longitude field.
-   `accesses` - alias `a` (object): action's accesses grouped by action or restriction. See *Access object* section to learn more about access' structure.
    -   `list` - alias `l` (array): action's accesses of the model.
    -   `admin` - alias `ad` (array): action's accesses restricted to `admin`.
    -   `owner` - alias `ow` (array): action's accesses restricted to `owner`.
    -   `auth` - alias `au` (array): action's accesses restricted to `authenticated`.
    -   `guest` - alias `gs` (array): action's accesses restricted to `guest`.
    -   `create` - alias `c` (object): the `create` action's access.
    -   `read` - alias `r` (object): the `read` action's access.
    -   `update` - alias `u` (object): the `update` action's access.
    -   `remove` - alias `d` (object): the `delete` action's access.
    -   `search` - alias `s` (object): the `search` action's access.
    -   `count` - alias `n` (object): the `count` action's access.
    -   `filter` - alias `f` (Function): filter action's accesses with a custom rule. Equivalent of `model.accesses.list.filter`.
    -   `properties` - alias `p` (object): pre-computed properties from action's accesses.
        -   `onlyAdmin` (boolean): model only contains actions restricted to `admin`.
        -   `onlyOwner` (boolean): model only contains actions restricted to `owner`.
        -   `onlyAuth` (boolean): model only contains actions restricted to `authenticated`.
        -   `onlyGuest` (boolean): model only contains actions restricted to `guest`.
        -   `maxAdmin` (boolean): most permissive access is `admin`.
        -   `maxOwner` (boolean): most permissive access is `owner`.
        -   `maxAuth` (boolean): most permissive access is `authenticated`.
        -   `maxGuest` (boolean): most permissive access is `guest`.
        -   `noAdmin` (boolean): there is no action restricted to `admin`.
        -   `noOwner` (boolean): there is no action restricted to `owner`.
        -   `noAuth` (boolean): there is no action restricted to `authenticated`.
        -   `noGuest` (boolean): there is no action restricted to `guest`.
        -   `hasAdmin` (boolean): there is at least one action restricted to `admin`.
        -   `hasOwner` (boolean): there is at least one action restricted to `owner`.
        -   `hasAuth` (boolean): there is at least one action restricted to `authenticated`.
        -   `hasGuest` (boolean): there is at least one action restricted to `guest`.

#### Field object

-   `name` (string): name of the field, as the user entered it.
-   `names` (object): name variants computed  the `name` property. As for the model object.
    -   `raw` (string): as the user entered it. Example `first_name`.
    -   `kebab` (string): example `first-name`.
    -   `big` (string): example `FIRST-NAME`.
    -   `header` (string): example `First-Name`.
    -   `snake` (string): example `first_name`.
    -   `constant` (string): example `FIRST_NAME`.
    -   `compact` (string): example `firstname`.
    -   `camel` (string): example `firstName`.
    -   `pascal` (string): example `FirstName`.
    -   `lower` (string): example `first name`.
    -   `upper` (string): example `FIRST NAME`.
    -   `capital` (string): example `First Name`.
-   `notes` (string): the notes of the field, as entered by the user.
-   `hasNotes` (boolean): the field has notes.
-   `primary` (boolean): field is flagged as `primary`.
-   `unique` (boolean): field is flagged as `unique`.
-   `label` (boolean): field is flagged as `label`.
-   `nullable` (boolean): field is flagged as `nullable`.
-   `multiple` (boolean): field is flagged as `multiple`.
-   `embedded` (boolean): field is flagged as `embedded`.
-   `searchable` (boolean): field is flagged as `searchable`.
-   `sortable` (boolean): field is flagged as `sortable`.
-   `hidden` (boolean): field is flagged as `hidden`.
-   `internal` (boolean): field is flagged as `internal`.
-   `restricted` (boolean): field is flagged as `restricted`.
-   `ownership` (boolean): field is flagged as `ownership`.
-   `type` (string): type of the field. Can be `string`, `number`, `boolean`, `datetime`, `entity`, `object` or `file`.
-   `subtype` (string): subtype of the field. The available values depend on the `type`:
    -   `string`: Can be `null`, `email`, `password`, `url`, `text` or `rich`.
    -   `number`: Can be `null`, `integer`, `float`, `latitude` or `longitude`.
    -   `boolean`: Is `null`.
    -   `datetime`: Can be `null`, `date` or `time`.
    -   `entity`: Is `null`.
    -   `object`: Is `null`.
    -   `file`: Can be `null`, `image`, `video`, `audio` or `document`.
-   `model` - alias `m` (object): target model object if the field is of type `entity`. `null` otherwise.
-   `enum` - alias `e` (array): an array containing all enum if the field is of type `enum`. `null` otherwise. See *Enum object* section to learn more about enum's structure.
-   `value` (string|string[]):
    -   If type is `entity`: raw ID of the target model (string).
    -   If type is `enum`: raw enum list (string[]).
    -   Otherwise `null`.
    
#### Enum object

-   `name` (string): name of the enum, as the user entered it.
-   `names` (object): name variants computed  the `name` property. As for the field and model object.
    -   `raw` (string): as the user entered it. Example `first_name`.
    -   `kebab` (string): example `first-name`.
    -   `big` (string): example `FIRST-NAME`.
    -   `header` (string): example `First-Name`.
    -   `snake` (string): example `first_name`.
    -   `constant` (string): example `FIRST_NAME`.
    -   `compact` (string): example `firstname`.
    -   `camel` (string): example `firstName`.
    -   `pascal` (string): example `FirstName`.
    -   `lower` (string): example `first name`.
    -   `upper` (string): example `FIRST NAME`.
    -   `capital` (string): example `First Name`.

#### Access object

-   `action` (string): name of the action. Can be `create`, `read`, `update`, `remove`, `search` or `count`.
-   `admin` (boolean): access is `admin`.
-   `owner` (boolean): access is `owner`.
-   `auth` (boolean): access is `authenticated`.
-   `guest` (boolean): access is `guest`.
-   `gteAdmin` (boolean): access is greater or equal than `admin` (should always be `true`).
-   `gteOwner` (boolean): access is greater or equal than `owner`.
-   `gteAuth` (boolean): access is greater or equal than `authenticated`.
-   `gteGuest` (boolean): access is greater or equal than `guest`.
-   `lteAdmin` (boolean): access is less or equal than `admin`.
-   `lteOwner` (boolean): access is less or equal than `owner`.
-   `lteAuth` (boolean): access is less or equal than `authenticated`.
-   `lteGuest` (boolean): access is less or equal than `guest` (should always be `true`).
