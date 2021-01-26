# Hapify templating

## Why use a specific syntax?

We designed a syntax to manipulate the [model object](../../model-object/), injected in the templates, that represents the data-model.
This syntax is optimized to play with this object properties with short words.
This allows us to manage complex ideas with short sentences.

For example, this loop in Javascript:

```javascript
for (let f of model.fields.list.filter(f => f.searchable && f.type === 'entity')) {
	out += '    Do something';
}
```

Will be written like this with Hapify syntax:

=== "Long syntax"

    ```hapify
    <<for Fields searchable and entity f>>
        Do something
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F se*tE f>>
        Do something
    <<@>>
    ```

## Names

### Model names

In a single-model template:

=== "Long syntax"

    ```hapify
    // Create a new <<Model lower>>
    const <<Model camel>> = new <<Model pascal>>();
    ```

=== "Short syntax"

    ```hapify
    // Create a new <<M a>>
    const <<M aA>> = new <<M AA>>();
    ```

For a model named `user group`, this will output as:

```javascript
// Create a new user group
const userGroup = new UserGroup();
```

### Field names

List all fields in a model:

=== "Long syntax"

    ```hapify
    <?php
    $fields = array(
    <<for Fields f>>
        '<<f camel>>',
    <<endfor>>
    );
    ```

=== "Short syntax"

    ```hapify
    <?php
    $fields = array(
    <<@ F f>>
        '<<f aA>>',
    <<@>>
    );
    ```

For a model with fields `name`, `created at` and `role`:

```php
<?php
$fields = array(
    'name',
    'createdAt',
    'role',
);
```

### Cases

Available cases are:

-   `camel` (short: `aA`) for `camelCase`
-   `pascal` (short: `AA`) for `PascalCase`
-   `lower` (short: `a`) for `lower case`
-   `capital` (short: `A`) for `Capital Case`
-   `kebab` (short: `a-a`) for `kebab-case`
-   `header` (short: `A-A`) for `Header-Case`
-   `snake` (short: `a_a`) for `snake_case`
-   `constant` (short: `A_A`) for `CONSTANT_CASE`
-   `compact` (short: `aa`) for `compactcase`
-   `raw` (short: `R`) (raw) for the original name

## Conditions

### Single condition

=== "Long syntax"

    ```hapify
    const utils = require('utils');
    <<if Fields entity>>
    const mongoDb = require('mongodb');
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    const utils = require('utils');
    <<? F tE>>
    const mongoDb = require('mongodb');
    <<?>>
    ```

For a model that contains at least one entity field, this will output as:

```javascript
const utils = require('utils');
const mongoDb = require('mongodb');
```

For a model that contains no entity field, this will output as:

```javascript
const utils = require('utils');
```

### Alternative conditions

=== "Long syntax"

    ```hapify
    <<if Fields entity>>
      // At least one entity field
    <<elseif Fields hidden>>
      // No entity field and at least one hidden field
    <<else>>
      // No entity field and no hidden field
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F tE>>
      // At least one entity field
    <<?? F hd>>
      // No entity field and at least one hidden field
    <<??>>
      // No entity field and no hidden field
    <<?>>
    ```

### Complex conditions

#### Operators

Operators available to write conditions are:

-   `and` - It can also be written `*` or `&&`
-   `or` - It can also be written `+` or `||`
-   `and not` - It can also be written `andNot`, `/` or `&& !`
-   `or not` - It can also be written `orNot`, `-` or `|| !`

Example:

=== "Long syntax"

    ```hapify
    <<if Fields (entity and hidden) or (unique and not multiple)>>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F (tE*hd)+(un/ml)>>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<?>>
    ```

Conditions can also be written with native operators.
Let's rewrite the last one:

=== "Long syntax"

    ```hapify
    <<if Fields (entity && hidden) || (unique && !multiple) >>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F (tE && hd) || (un && !ml) >>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<?>>
    ```

#### Conditions on occurrences

=== "Long syntax"

    ```hapify
    <<if3 Fields number>>
      // This block is reach if the model has at least 3 number field
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<?3 F tN>>
      // This block is reach if the model has at least 3 number field
    <<?>>
    ```

### Conditions over models

#### Test a single model

In a single-model template.

=== "Long syntax"

    ```hapify
    <<if Model isGeolocated>>
      // This block is reached if the model is geolocated.
      // that's means it has at least one latitude field and one longitude field
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? M pGeo>>
      // This block is reached if the model is geolocated.
      // that's means it has at least one latitude field and one longitude field
    <<?>>
    ```

#### Test a list of models

In a multiple-model template.

=== "Long syntax"

    ```hapify
    <<if Model not onlyGuest>>
      // This block is reached if at least one model has not only guest actions
      import 'session-service';
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? M !pOGs>>
      // This block is reached if at least one model has not only guest actions
      import 'session-service';
    <<?>>
    ```

### Available objects & filters

#### Root object

`M` refers to the top object: the model in a single-model template or the array of models in a multiple-model template.

#### Filterable and testable objects

In the case of a single-model template:

-   `Fields` (short: `F`) is the fields list
-   `Dependencies` (short: `D`) is the dependencies list (list of models)
-   `ReferencedIn` (alias: `RefModels`, short: `R`) is the models list that depend from this one
-   `PrimaryField` (short: `P`) is the models primary field
-   `Accesses` (short: `A`) is the action accesses list
-   `CreateAccess` (short: `Ac`) is the create action access
-   `ReadAccess` (short: `Ar`) is the read action access
-   `UpdateAccess` (short: `Au`) is the update action access
-   `RemoveAccess` (short: `Ad`) is the delete (remove) action access
-   `SearchAccess` (short: `As`) is the search action access
-   `CountAccess` (short: `An`) is the count action access

#### Filtering on field properties

Short-codes available for a field:

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
-   `enum` (short: `tU`) for type `enum`
-   `entity` (short: `tE`) for type `entity`
-   `object` (short: `tO`) for type `object`
-   `file` (short: `tF`) for type `file`
    -   `image` (short: `tFi`) for type `file` and subtype `image`
    -   `video` (short: `tFv`) for type `file` and subtype `video`
    -   `audio` (short: `tFa`) for type `file` and subtype `audio`
    -   `document` (short: `tFd`) for type `file` and subtype `document`

#### Filtering on model properties

Short-codes available for the properties of a model:

-   `mainlyHidden` (short: `pMHd`) most of the fields are hidden (strictly)
-   `mainlyInternal` (short: `pMIn`) most of the fields are internal (strictly)
-   `isGeolocated` (short: `pGeo`) the model contains at least one latitude field and one longitude field
-   `isGeoSearchable` (short: `pGSe`) the model contains at least one searchable latitude field and one searchable longitude field

Short-codes available for the access properties of a model:

-   `onlyAdmin` (short: `pOAd`) the model only contains actions restricted to `admin`
-   `onlyOwner` (short: `pOOw`) the model only contains actions restricted to `owner`
-   `onlyAuth` (short: `pOAu`) the model only contains actions restricted to `authenticated`
-   `onlyGuest` (short: `pOGs`) the model only contains actions restricted to `guest`
-   `maxAdmin` (short: `pMAd`) the most permissive access is `admin`
-   `maxOwner` (short: `pMOw`) the most permissive access is `owner`
-   `maxAuth` (short: `pMAu`) the most permissive access is `authenticated`
-   `maxGuest` (short: `pMGs`) the most permissive access is `guest`
-   `noAdmin` (short: `pNAd`) there is no action restricted to `admin`
-   `noOwner` (short: `pNOw`) there is no action restricted to `owner`
-   `noAuth` (short: `pNAu`) there is no action restricted to `authenticated`
-   `noGuest` (short: `pNGs`) there is no action restricted to `guest`

#### Filtering on action accesses

Short-codes available for the access of an action:

-   `admin` (short: `ad`) the access is `admin`
-   `owner` (short: `ow`) the access is `owner`
-   `auth` (short: `au`) the access is `auth`
-   `guest` (short: `gs`) the access is `guest`
-   `gteAdmin` (short: `[ad`) the access is greater or equal than `admin`
-   `gteOwner` (short: `[ow`) the access is greater or equal than `owner`
-   `gteAuth` (short: `[au`) the access is greater or equal than `auth`
-   `gteGuest` (short: `[gs`) the access is greater or equal than `guest`
-   `lteAdmin` (short: `ad]`) the access is less or equal than `admin`
-   `lteOwner` (short: `ow]`) the access is less or equal than `owner`
-   `lteAuth` (short: `au]`) the access is less or equal than `auth`
-   `lteGuest` (short: `gs]`) the access is less or equal than `guest`

## Iterations

Iterations use the same operators as conditions.

### Simple iteration

Loop over all fields of a model that are not hidden and assign them to variable `f`:

=== "Long syntax"

    ```hapify
    <?php
    $fields = array(
    <<for Fields not hidden f>>
        '<<f camel>>',
    <<endfor>>
    );
    ```

=== "Short syntax"

    ```hapify
    <?php
    $fields = array(
    <<@ F !hd f>>
        '<<f aA>>',
    <<@>>
    );
    ```

For a model with fields `name`, `created at` and `role`, but `role` is hidden:

```php
<?php
$fields = array(
    'name',
    'createdAt',
);
```

### Shortened iteration

Loop over the first 2 fields of a model:

=== "Long syntax"

    ```hapify
    <?php
    $fields = array(
    <<for2 Fields f>>
        '<<f camel>>',
    <<endfor>>
    );
    ```

=== "Short syntax"

    ```hapify
    <?php
    $fields = array(
    <<@2 F f>>
        '<<f aA>>',
    <<@>>
    );
    ```

For a model with fields `name`, `email` and `role`:

```php
<?php
$fields = array(
    'name',
    'email',
);
```

### Nested iterations

#### Loop over enums

In a single-model, this will define a TypeScript type for all enum fields:

=== "Long syntax"

    ```hapify
    <<for Fields enum field>>
    type <<field pascal>> =<<for field.enum e>> | '<<e snake>>'<<endfor>>;
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F tU f>>
    type <<f AA>> =<<@ f.e e>> | '<<e a_a>>'<<@>>;
    <<@>>
    ```

=== "Sample output"

    ```javascript
    type Role = | 'admin' | 'user' | 'customer';
    ```

#### Loop over fields of all models

In a multiple-model template, this will loop over all fields of all models:

=== "Long syntax"

    ```hapify
    const models = {
    <<for Models m>>
        <<m camel>>: [
        <<for m.f f>>
            '<<f camel>>',
        <<endfor>>
        ],
    <<endfor>>
    }
    ```

=== "Short syntax"

    ```hapify
    const models = {
    <<@ M m>>
        <<m aA>>: [
        <<@ m.f f>>
            '<<f aA>>',
        <<@>>
        ],
    <<@>>
    }
    ```

=== "Sample output"

    ```javascript
    const models = {
        user: [
            'id',
            'createdAt',
            'email',
            'name',
        ],
        place: [
            'id',
            'name',
            'category',
        ],
        placeCategory: [
            'id',
            'createdAt',
            'email',
            'name',
        ],
    }
    ```

## Raw inputs & interpolation

This operator allows you to write pure Javascript.

### Custom variable

Define a custom variable and print it:

```hapify
<<< const length = model.fields.length; >>>

// This model has <<=length>> fields
```

### Custom function

Define a custom function and call it:

=== "Long syntax"

    ```hapify
    <<<
    function fieldName(f) {
        return f.names.snake.replace('_', ':');
    }
    >>>
    <<for Fields f>>
    <<=fieldName(f)>>
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<<
    function fieldName(f) {
        return f.names.snake.replace('_', ':');
    }
    >>>
    <<@ F f>>
    <<=fieldName(f)>>
    <<@>>
    ```

=== "Sample output"

    ```
    id
    created:at
    place:category
    ```

### Error

Do not write this: `#!hapify <<= JSON.stringify(model) >>`.
The `model` object has recursive properties. Therefore this command will lead to an infinite loop.

## Comments

This syntax writes a comment in the template without any output to the generated file.

```hapify
<<# This is just a comment>>
```

## Reserved words

The following list of words cannot be used for naming variables.

`A`, `Ac`, `Accesses`, `ad`, `Ad`, `admin`, `An`, `and`, `andNot`, `Ar`, `As`, `au`, `Au`, `audio`, `auth`, `boolean`, `CountAccess`, `CreateAccess`, `D`, `date`, `datetime`, `Dependencies`, `document`, `else`, `elseif`, `em`, `email`, `embedded`, `endfor`, `endif`, `entity`, `enum`, `F`, `Fields`, `file`, `float`, `for`, `gs`, `gteAdmin`, `gteAuth`, `gteGuest`, `gteOwner`, `guest`, `hd`, `hidden`, `if`, `image`, `in`, `integer`, `internal`, `isGeolocated`, `isGeoSearchable`, `label`, `latitude`, `lb`, `longitude`, `lteAdmin`, `lteAuth`, `lteGuest`, `lteOwner`, `M`, `mainlyHidden`, `mainlyInternal`, `maxAdmin`, `maxAuth`, `maxGuest`, `maxOwner`, `ml`, `Model`, `Models`, `multiple`, `noAdmin`, `noAuth`, `noGuest`, `noOwner`, `not`, `nu`, `nullable`, `number`, `object`, `onlyAdmin`, `onlyAuth`, `onlyGuest`, `onlyOwner`, `or`, `orNot`, `os`, `out`, `ow`, `owner`, `ownership`, `P`, `password`, `pGeo`, `pGSe`, `pMAd`, `pMAu`, `pMGs`, `pMHd`, `pMIn`, `pMOw`, `pNAd`, `pNAu`, `pNGs`, `pNOw`, `pOAd`, `pOAu`, `pOGs`, `pOOw`, `pr`, `primary`, `PrimaryField`, `R`, `ReadAccess`, `ReferencedIn`, `RefModels`, `RemoveAccess`, `restricted`, `rich`, `richText`, `root`, `rs`, `se`, `searchable`, `SearchAccess`, `so`, `sortable`, `string`, `tB`, `tD`, `tDd`, `tDt`, `tE`, `text`, `tF`, `tFa`, `tFd`, `tFi`, `tFv`, `time`, `tN`, `tNf`, `tNg`, `tNi`, `tNt`, `tO`, `tS`, `tSe`, `tSp`, `tSr`, `tSt`, `tSu`, `tU`, `un`, `unique`, `UpdateAccess`, `url`, `video`.

## Learn more

If you want to learn more about Hapify syntax and how it is mapped to the [model object](../../model-object/) injected in the templates, please refer to this [documentation](../../model-object/).
