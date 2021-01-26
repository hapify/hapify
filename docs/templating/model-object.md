# Model object

This document describes the structure of the object that represents a model when writing a template.

The second part of the document explains how the Hapify syntax map this object properties to an understandable syntax.

Before reading this, you should have a look to the [key-concepts](../../concepts/key-concepts/) section.

## Within the templates

### Model injection

The template input can be defined as `one` or `all` models.
During the generation process, if defined as `one`, the template will be called one time for each model. Therefore it will generate one output file for each model.
If defined as `all`, the template will be called once for all models. Then it will generate one output file.

#### Single model

If the template requires one model, therefore, an object `model` (alias `m`) will be available as a global variable in the template.
In a Hapify template it will be available under `Model` or `M`.
In a Javascript template it will be available under `model` or `m`.

#### Multiple models

If the template requires all the models, therefore, an array `models` (alias `m`) will be available as a global variable in the template.
This array contains all the available models.
In a Hapify template it will be available under `Models` or `M`.
In a Javascript template it will be available under `models` or `m`.

### Structure of the model object

The following objects will be available in the template.

**Model object**

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

**Field object**

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
    
**Enum object**

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

**Access object**

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

## Hapify Syntax

This part show how the Hapify syntax is built on top of the model object described above.
This syntax is optimized to manipulate this object and access its properties with simple words.

### Wrappers

Hapify syntax blocks are wrapped by two tags:

-   Opening tag: `<<`.
-   Closing tag: `>>`.

#### Escape wrappers

Usually used for binary operations, these wrappers can be escaped.
Escaped tags `\<\<` (and `\>\>`) are replaced by `<<` (and `>>`) in the generated content.

### Syntax

Hapify templates can be written with a long or short syntax.

Both have advantages:
 - Short syntax does not interfere with the target code when reading the template, due to a shorter meta code.
 - Long syntax is explicit and can be read naturally.

In a template, you can mix both syntax.

**A loop with Hapify syntax**

=== "Long syntax"

    ```hapify
    <<for Fields searchable and sortable and not label f>>
        // Code here
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F se*so/lb f>>
        // Code here
    <<@>>
    ```

Explanations:

-   `for` (alias `@`) is the operation
-   `Fields` (alias `F`) is the variable
-   `searchable and sortable and not label` (short syntax: `se*so/lb`) is the condition (optional)
-   `f` is the assignment variable

#### Variable naming

As a convention, we use lower case to name dynamically defined variables (user variables) and upper case for pre-defined variables (system variables).
An user variable cannot use system reserved words. To see the complete list of reserved words, please refer to the end of this file.

To refer to the root variable, we use `Model` or `Models` (short: `M`).
It refers to the model in a single-model template and to the models list in a multiple-model template.

By default, in a case of a single-model template:

-   `Fields` (short: `F`) fields list: `model.fields.list`
-   `Dependencies` (short: `D`) model's dependencies list: `model.dependencies`
-   `ReferencedIn` (alias: `RefModels`, short: `R`) dependent models list: `model.referencedIn`
-   `PrimaryField` (short: `P`) model's primary field: `model.fileds.primary`
-   `Accesses` (short: `A`) action's accesses list: `model.accesses.list`
-   `CreateAccess` (short: `Ac`) create action's access: `model.accesses.create`
-   `ReadAccess` (short: `Ar`) read action's access: `model.accesses.read`
-   `UpdateAccess` (short: `Au`) update action's access: `model.accesses.update`
-   `RemoveAccess` (short: `Ad`) delete (remove) action's access: `model.accesses.remove`
-   `SearchAccess` (short: `As`) search action's access: `model.accesses.search`
-   `CountAccess` (short: `An`) count action's access: `model.accesses.count`

### Conditional operator

This operator can be used over an object or an array of objects.
If used over an array, it will test the length of the array filtered by the condition.

As an array, it can be used over any object containing a method `filter` that receives a callback returning a boolean.
In the model structure, `model.dependencies` is an object that contains a `filter` method.
Then, this operator can test if a model has dependencies that has fields with a specific condition.

#### Syntax

Tests if the model has at least one multiple entity.

=== "Long syntax"
    
    ```hapify
    <<if Fields entity and multiple>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F tE*ml>>
        // ...
    <<?>>
    ```

#### Operators

Operators can be written as words or as algebra operators.

-   `and` is an intersection. It can also be written `*` or `&&`. For example `sortable and searchable` equals `sortable * searchable` equals `sortable && searchable`.
-   `or` is an union. It can also be written `+` or `||`. For example `sortable or searchable` equals `sortable + searchable` equals `sortable || searchable`.
-   `and not` is an intersection with the complementary. It can also be written `andNot`, `/` or `&& !`. For example `sortable andNot searchable` equals `sortable and not searchable` equals `sortable * searchable` equals `sortable && !searchable`.
-   `or not` is an union with the complementary. It can also be written `orNot`, `-` or `|| !`. For example `sortable orNot searchable` equals `sortable or not searchable` equals `sortable - searchable` equals `sortable || !searchable`.

If the condition starts with `andNot`, `orNot`, `-` or `/` it will be converted to `!`.
Therefore, `-searchable*sortable` and `andNot searchable and sortable` are equivalent to `not searchable and sortable`.

**Example**

=== "Long syntax"

    ```hapify
    <<if Fields not nullable andNot (number or not date)>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F !nu/(tN-tDd)>>
        // ...
    <<?>>
    ```

#### Properties short-codes

You can filter an array or to test a field by its properties.

Available properties for a field:

-   `primary` (short: `pr`) for boolean `primary`
-   `unique` (short: `un`) for boolean `unique`
-   `label` (short: `lb`) for boolean `label`
-   `nullable` (short: `nu`) for boolean `nullable`
-   `multiple` (short: `ml`) for boolean `multiple`
-   `embedded` (short: `em`) for boolean `embedded`
-   `searchable` (short: `se`) for boolean `searchable`
-   `sortable` (short: `so`) for boolean `sortable`
-   `hidden` (short: `hd`) for boolean `hidden`
-   `internal` (short: `in`) for boolean `internal`
-   `restricted` (short: `rs`) for boolean `restricted`
-   `ownership` (short: `os`) for boolean `ownership`
-   `string` (short: `tS`) for type `string`
    -   `email` (short: `tSe`) for type `string` and subtype `email`
    -   `password` (short: `tSp`) for type `string` and subtype `password`
    -   `url` (short: `tSu`) for type `string` and subtype `url`
    -   `text` (short: `tSt`) for type `string` and subtype `text`
    -   `richText` (alias: `rich`, short: `tSr`) for type `string` and subtype `rich`
-   `number` (short: `tN`) for type `number`
    -   `integer` (short: `tNi`) for type `number` and subtype `integer`
    -   `float` (short: `tNf`) for type `number` and subtype `float`
    -   `latitude` (short: `tNt`) for type `number` and subtype `latitude`
    -   `longitude` (short: `tNg`) for type `number` and subtype `longitude`
-   `boolean` (short: `tB`) for type `boolean`
-   `datetime` (short: `tD`) for type `datetime`
    -   `date` (short: `tDd`) for type `datetime` and subtype `date`
    -   `time` (short: `tDt`) for type `datetime` and subtype `time`
-   `entity` (short: `tE`) for type `entity`
-   `object` (short: `tO`) for type `object`
-   `file` (short: `tF`) for type `file`
    -   `image` (short: `tFi`) for type `file` and subtype `image`
    -   `video` (short: `tFv`) for type `file` and subtype `video`
    -   `audio` (short: `tFa`) for type `file` and subtype `audio`
    -   `document` (short: `tFd`) for type `file` and subtype `document`

**Example**

=== "Long syntax"

    ```hapify
    <<if Fields (restricted or internal) and not number>>
        // Current model has at least one field matching to the condition
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F (rs+in)/tN>>
        // Current model has at least one field matching to the condition
    <<?>>
    ```

You can also test a model or filter a list of models by its pre-computed properties:

-   `mainlyHidden` (short: `pMHd`) for boolean `mainlyHidden`
-   `mainlyInternal` (short: `pMIn`) for boolean `mainlyInternal`
-   `isGeolocated` (short: `pGeo`) for boolean `isGeolocated`
-   `isGeoSearchable` (short: `pGSe`) for boolean `isGeoSearchable`

**Example**

=== "Long syntax"

    ```hapify
    <<for Models isGeolocated model>>
        // For each model matching the condition
    <<endfor>>
    ```
    
=== "Short syntax"

    ```hapify
    <<@ M pGeo m>>
        // For each model matching the condition
    <<@>>
    ```

##### Access controls

You can filter an array of actions or to test an action by its access properties:

-   `admin` (short: `ad`) for boolean `admin`
-   `owner` (short: `ow`) for boolean `owner`
-   `auth` (short: `au`) for boolean `auth`
-   `guest` (short: `gs`) for boolean `guest`
-   `gteAdmin` (short: `[ad`) for boolean `gteAdmin`
-   `gteOwner` (short: `[ow`) for boolean `gteOwner`
-   `gteAuth` (short: `[au`) for boolean `gteAuth`
-   `gteGuest` (short: `[gs`) for boolean `gteGuest`
-   `lteAdmin` (short: `ad]`) for boolean `lteAdmin`
-   `lteOwner` (short: `ow]`) for boolean `lteOwner`
-   `lteAuth` (short: `au]`) for boolean `lteAuth`
-   `lteGuest` (short: `gs]`) for boolean `lteGuest`

**Examples**

Loop over all actions' accesses:

=== "Long syntax"

    ```hapify
    <<for Accesses gteAuth action>>
        // For each action of the current model that requires auth or admin accees
    <<endfor>>
    ```
    
=== "Short syntax"

    ```hapify
    <<@ A [au a>>
        // For each action of the current model that requires auth or admin accees
    <<@>>
    ```

Test one action's access:

=== "Long syntax"

    ```hapify
    <<if ReadAccess guest>>
        // Anyone can read this model
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? Ar gs>>
        // Anyone can read this model
    <<?>>
    ```

Words available for the access' properties of a model:

-   `onlyAdmin` (short: `pOAd`) for boolean `onlyAdmin`
-   `onlyOwner` (short: `pOOw`) for boolean `onlyOwner`
-   `onlyAuth` (short: `pOAu`) for boolean `onlyAuth`
-   `onlyGuest` (short: `pOGs`) for boolean `onlyGuest`
-   `maxAdmin` (short: `pMAd`) for boolean `maxAdmin`
-   `maxOwner` (short: `pMOw`) for boolean `maxOwner`
-   `maxAuth` (short: `pMAu`) for boolean `maxAuth`
-   `maxGuest` (short: `pMGs`) for boolean `maxGuest`
-   `noAdmin` (short: `pNAd`) for boolean `noAdmin`
-   `noOwner` (short: `pNOw`) for boolean `noOwner`
-   `noAuth` (short: `pNAu`) for boolean `noAuth`
-   `noGuest` (short: `pNGs`) for boolean `noGuest`

**Example**

=== "Long syntax"

    ```hapify
    <<if Accesses onlyAdmin>>
        // All actions on this model are restricted to admins
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? A pOAd>>
        // All actions on this model are restricted to admins
    <<?>>
    ```

#### Structure

A complete conditional writing will look like this:

=== "Long syntax"

    ```hapify
    <<if4 Fields hidden>>
        // This model has at least 4 hidden fields
    <<elseif2 Fields label or boolean>>
        // This model has at least 2 label or boolean fields
    <<elseif PrimaryField string>>
        // The primary key of the model is a string
    <<else>>
        // Something else
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<?4 F hd>>
        // This model has at least 4 hidden fields
    <<??2 F lb+tB>>
        // This model has at least 2 label or boolean fields
    <<?? P tS>>
        // The primary key of the model is a string
    <<??>>
        // Something else
    <<?>>
    ```

=== "JavaScript"

    ```javascript
    if (model.fields.list.filter(f => f.hidden).length >= 4) {
        out += '    // This model has at least 4 hidden fields';
    } else if (model.fields.list.filter(f => f.label || f.type === 'boolean').length >= 2) {
        out += '    // This model has at least 2 label or boolean fields';
    } else if (model.fields.primary.type === 'string') {
        out += '    // The primary key of the model is a string';
    } else {
        out += '    // Something else';
    }
    ```

#### Statements analysis

##### if

`#!hapify <<if4 Fields hidden>>` is equivalent to: `if (condition) {`.

-   `<<if` is the opening tag.
-   `4` is the minimum length of the filtered array. This value is optional and only usable if the variable is an array. If omitted, we assume the required length is 1.
-   `Fields` is the variable to test. It can be and array or an object.
-   `hidden` is the condition to test the object or the items of an array.
-   `>>` closes the tag

##### else if

`#!hapify <<elseif2 Fields label or boolean>>` Js equivalent would be: `} else if (condition) {`.
It follows the same rules as an **if** statement, unless its opening tag is `<<elseif`.

##### else

`#!hapify <<else>>` is equivalent to: `} else {`.

##### ending

`#!hapify <<endif>>` is equivalent to: `}`.

#### Examples

##### Example with conditions:

This tests if the model has some searchable and sortable but not hidden fields

=== "Long syntax"

    ```hapify
    <<if Fields searchable and sortable and not hidden>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F se*so/hd>>
        // ...
    <<?>>
    ```

=== "JavaScript"
    
    ```javascript
    if (model.fields.list.filter(f => f.searchable && f.sortable && !f.hidden).length > 0) {
        out += '    // ...';
    }
    ```

##### Example without condition:

=== "Long syntax"

    ```hapify
    <<if Fields>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F>>
        // ...
    <<?>>
    ```

=== "JavaScript"

    ```javascript
    if (model.fields.list.length > 0) {
        out += '    // ...';
    }
    ```

##### Example with more than 2 elements

Example to test if the model has at least two label fields

=== "Long syntax"

    ```hapify
    <<if2 Fields label>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<?2 F lb>>
        // ...
    <<?>>
    ```

=== "JavaScript"

    ```javascript
    if (model.fields.list.filter(f => f.label).length >= 2) {
        out += '    // ...';
    }
    ```

##### Example for a specific action's access

Example to test if the update action is restricted to admin or owner

=== "Long syntax"

    ```hapify
    <<if UpdateAccess admin or owner>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? Au ad+ow>>
        // ...
    <<?>>
    ```

=== "JavaScript"

    ```javascript
    if (model.accesses.update.admin || model.accesses.update.owner) {
        out += '    // ...';
    }
    ```

##### Example for many action's accesses

Example to test if at least one action is restricted to authenticated user or less

=== "Long syntax"

    ```hapify
    <<if Accesses lteAuth>>
        // ...
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? A au]>>
        // ...
    <<?>>
    ```

=== "JavaScript"

    ```javascript
    if (model.accesses.filter(a => a.lteAuth).length > 0) {
        out += '    // ...';
    }
    ```

### Iteration operator

The loop operation (foreach) is `for` (short: `@`).

It applies only to an array.
It uses the same conditions syntax as the conditional operator.

Actually, it inherits from the conditional operator.

#### Syntax

The operators and the properties used in the condition are the same as for the conditional operator.
This will loop over all fields of type entity and multiple and assign the current field to the variable `f`.

=== "Long syntax"

    ```hapify
    <<for Fields entity and multiple f>>
        // ...
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F tE*ml f>>
        // ...
    <<@>>
    ```

#### Structure

A complete iteration will look like this:

=== "Long syntax"

    ```hapify
    <<for4 Fields hidden f>>
        // Do something
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@4 F hd f>>
        // Do something
    <<@>>
    ```

=== "JavaScript"

    ```javascript
    for (let f of model.fields.list.filter(f => f.hidden).slice(0, 4)) {
        out += '    // Do something';
    }
    ```

#### Analysis

##### loop

`#!hapify <<for4 Fields hidden f>>` is equivalent to: `for (assigment + condition) {`.

-   `<<for` is the opening tag.
-   `4` is the maximum length of the filtered array. This value is optional. If omitted, we do not slice the filtered array.
-   `Fields` is the variable to filter and to loop on. It must be iterable.
-   `hidden` is the condition to test the items of the array.
-   `f` is the assignment variable. This variable will be available inside the loop's scope.
-   `>>` closes the tag.

##### ending 

`#!hapify <<endfor>>` is equivalent to: `}`.

#### Examples

##### Example with conditions over fields:

To loop over model's searchable entity fields

=== "Long syntax"

    ```hapify
    <<for Fields searchable and entity f>>
        // ...
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F se*tE f>>
        // ...
    <<@>>
    ```

=== "JavaScript"

    ```javascript
    for (let f of model.fields.list.filter(f => f.searchable && f.type === 'entity')) {
        out += '    // ...';
    }
    ```

##### Example with conditions over models:

In the context of a multiple-model template, this loops over all models that are geo-located.

=== "Long syntax"

    ```hapify
    <<for Models isGeolocated m>>
        // ...
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ M pGeo m>>
        // ...
    <<@>>
    ```

=== "JavaScript"

    ```javascript
    for (let m of model.filter(i => i.properties.isGeolocated)) {
        out += '    // ...';
    }
    ```

##### Example with 2 elements

This example will loop over the two first dependency models that have sortable fields.

=== "Long syntax"

    ```hapify
    <<for2 Dependencies sortable d>>
        // ...
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@2 D so d>>
        // ...
    <<@>>
    ```

=== "JavaScript"

    ```javascript
    for (let d of model.dependencies.filter(f => f.sortable).slice(0, 2)) {
        out += '    // ...';
    }
    ```

##### Example without conditions

This will loop over all fields.

=== "Long syntax"

    ```hapify
    <<for Fields f>>
        // ...
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F f>>
        // ...
    <<@>>
    ```

=== "JavaScript"

    ```javascript
    for (let f of model.fields.list) {
        out += '    // ...';
    }
    ```

##### Example with accesses

This will loop over all actions restricted to admin or owner.

=== "Long syntax"

    ```hapify
    <<for Accesses admin or owner>>
        // ...
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ A ad+ow>>
        // ...
    <<@>>
    ```

=== "JavaScript"

    ```javascript
    for (let f of model.accesses.list.filter(a => a.admin || a.owner)) {
        out += '    // ...';
    }
    ```

### Name interpolation

Name interpolation is the default operation.
To print the name of a variable (model or field), we omit the operation.

Example for the model's name as upper camel:

=== "Long syntax"

    ```hapify
    <<Model pascal>>
    ```

=== "Short syntax"

    ```hapify
    <<M AA>>
    ```

=== "Output sample"

    ```
    UserProfile
    ```

Example for field's name as kebab:

=== "Long syntax"

    ```hapify
    <<f kebab>>
    ```

=== "Short syntax"

    ```hapify
    <<f a-a>>
    ```

=== "Output sample"

    ```
    creation-date
    ```

The values for the name are:

-   `camel` (short: `aA`) for `names.camel`
-   `pascal` (short: `AA`) for `names.pascal`
-   `lower` (short: `a`) for `names.lower`
-   `capital` (short: `A`) for `names.capital`
-   `kebab` (short: `a-a`) for `names.kebab`
-   `header` (short: `A-A`) for `names.header`
-   `snake` (short: `a_a`) for `names.snake`
-   `constant` (short: `A_A`) for `names.constant`
-   `compact` (short: `aa`) for `names.compact`
-   `raw` (short: `R`) for `names.raw`

### Raw inputs

This operator allows you to write pure Javascript.

#### Syntax

-   Opening tag: `<<<`
-   Closing tag: `>>>`

Those tags are also escapable.

Between those tags you can write Javascript code to inject new variables and new functions into the template scope.

#### Output

The output variable is named `out`.
Therefore to concatenate a string to the template output, you have to write: `#!hapify <<< out += 'more content here'; >>>`.

#### Examples

Insert a custom variable:

```hapify
<<< const l = model.fields.length; >>>
```

Declare a processing function:

```hapify
<<<
function fieldName(f) {
    return f.names.snake.toUpperCase();
}
>>>
```

### Interpolation

This operator prints the content of a variable.
It is useful to print the result of a custom function or the value of a custom variable.

#### Syntax

`#!hapify <<= myFunction() >>` or `#!hapify <<=customVariable>>`

This is equivalent to `#!hapify <<< out += myFunction(); >>>`.

#### Error

Do not write this: `#!hapify <<= JSON.stringify(model) >>`.
The `model` object has recursive properties. Therefore this command will enter an infinite loop.

### Comments

This operator writes a comment in the template without any output to the generated file.

```hapify
<<# This is just a comment>>
```
