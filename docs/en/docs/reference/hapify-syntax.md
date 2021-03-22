## Why use a specific syntax?

We have designed a syntax able to manipulate the [model object](./model-object.md) injected in the templates.
This syntax is optimized to play with the properties of this model object using short words.
This allows to handle complex ideas with simple sentences.

For example, this loop in JavaScript :

```javascript
for (let field of root.fields.filter(f => f.searchable && f.type === 'entity')) {
	out += '    Do something';
}
```

will be written like this with the Hapify syntax:

=== "Hapify (long)"

    ```hapify
    <<for Fields searchable and entity field>>
        Do something
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ F se*tE f>>
        Do something
    <<@>>
    ```
    
### Long and short syntaxes

Hapify templates can be written with a long or a short syntax.

Both have their advantages:

 - The short syntax does not interfere with the target code when reading the template, thanks to a shorter meta-code.
 - The long syntax is explicit and can be read easily.

In the same template, you can mix both syntaxes.

!!! note "Note"
    All code examples below are translated into JavaScript equivalent for your information.
    During generation, the Hapify syntax is converted to similar JavaScript code.
    
## Tags

Hapify syntax blocks are wrapped by two tags:

- opening: `<<`.
- closing: `>>`.

### Escaping

Generally used for binary operations, these tags can be escaped.
The escaped tags ``<<` (and ``>>`) are replaced by `<<` (and `>>`) during generation.

## Names

### Data model names

In a template of type `one model` :

=== "Hapify (long)"

    ```hapify
    // Create a new <<Model lower>>
    const <<Model camel>> = new <<Model pascal>>();
    ```

=== "Hapify (short)"

    ```hapify
    // Create a new <<M a>>
    const <<M aA>> = new <<M AA>>();
    ```
    
=== "JavaScript equivalent"

    ```javascript
    out += `// Create a new ${root.names.lower}
    const ${root.names.camel} = new ${root.names.pascal}();`;
    ```

For a data model named `user group`, the result will be as follows:

```javascript
// Create a new user group
const userGroup = new UserGroup();
```

### Field names

List all fields of a data model:

=== "Hapify (long)"

    ```hapify
    <?php
    $fields = array(
    <<for Fields field>>
        '<<field camel>>',
    <<endfor>>
    );
    ```

=== "Hapify (short)"

    ```hapify
    <?php
    $fields = array(
    <<@ F f>>
        '<<f aA>>',
    <<@>>
    );
    ```
    
=== "JavaScript equivalent"

    ```javascript
    out += `<?php
    $fields = array(
        ${root.fields.list.map(f => "'"+f.names.camel+"'").join(",\n\t")}
    );`;
    ```

For a data model with `name`, `created at` and `role` fields:

```php
<?php
$fields = array(
    'name',
    'createdAt',
    'role',
);
```

### Cases

The available cases are:

-   `camel` (alias : `aA`) for `camelCase`
-   `pascal` (alias : `AA`) for `PascalCase`
-   `lower` (alias : `a`) for `lower case`
-   `capital` (alias : `A`) for `Capital Case`
-   `kebab` (alias : `a-a`) for `kebab-case`
-   `header` (alias : `A-A`) for `Header-Case`
-   `snake` (alias : `a_a`) for `snake_case`
-   `constant` (alias : `A_A`) for `CONSTANT_CASE`
-   `compact` (alias : `aa`) for `compactcase`
-   `raw` (alias : `R`) (raw) for the original name

## Conditions

### Simple condition

=== "Hapify (long)"

    ```hapify
    const utils = require('utils');
    <<if Fields entity>>
    const mongoDb = require('mongodb');
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    const utils = require('utils');
    <<? F tE>>
    const mongoDb = require('mongodb');
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    out += `const utils = require('utils');`;
    if (root.fields.filter(f => f.type === 'entity').length > 0) {
        out += `\nconst mongoDb = require('mongodb');`;
    }
    ```

For a data model that contains at least one field of type `entity`, the result will be as follows:

```javascript
const utils = require('utils');
const mongoDb = require('mongodb');
```

For a data model that does not contain a field of type `entity`, the result will be as follows:

```javascript
const utils = require('utils');
```

#### Without filter

Field filtering is optional.

=== "Hapify (long)"

    ```hapify
    <<if Fields>>
        // this model has at least one field
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? F>>
        // this model has at least one field
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.fields.list.length > 0) {
        out += '    // this model has at least one field';
    }
    ```

### Alternative conditions

=== "Hapify (long)"

    ```hapify
    <<if Fields entity>>
      // At least one entity field
    <<elseif Fields hidden>>
      // No entity field and at least one hidden field
    <<else>>
      // No entity field and no hidden field
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? F tE>>
      // At least one entity field
    <<?? F hd>>
      // No entity field and at least one hidden field
    <<??>>
      // No entity field and no hidden field
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.fields.filter(f => f.type === 'entity').length > 0) {
        out += '    // At least one entity field';
    } else if (root.fields.filter(f => f.hidden).length > 0) {
        out += '    // No entity field and at least one hidden field';
    } else {
        out += '    // No entity field and no hidden field';
    }
    ```

### Complex conditions

#### Operators

The operators available for conditions are :

-   `and` - alias `*` or `&&`
-   `or` - alias `+` or `||`
-   `and not` - alias `andNot`, `/` or `&& !`
-   `or not` - alias `orNot`, `-` or `|| !`

**Example**

=== "Hapify (long)"

    ```hapify
    <<if Fields (entity and hidden) or (unique and not multiple)>>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? F (tE*hd)+(un/ml)>>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    for (let field of root.fields.filter(f => (f.type === 'entity' && f.hidden) || (f.unique && !f.multiple))) {
        out += '    // ...';
    }
    ```

Conditions can also be written with native operators.
Let's rewrite this last condition:

=== "Hapify (long)"

    ```hapify
    <<if Fields (entity && hidden) || (unique && !multiple) >>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? F (tE && hd) || (un && !ml) >>
      // This code block is reached if the model has at least one field that validates this conditions:
      // (type entity AND hidden) OR (unique AND NOT multiple)
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    for (let field of root.fields.filter(f => (f.type === 'entity' && f.hidden) || (f.unique && !f.multiple))) {
        out += '    // ...';
    }
    ```

#### Conditions on the number of occurrences

By specifying a number after the `if`, we can add a condition on the minimum number of required elements. In this case, the fields :

=== "Hapify (long)"

    ```hapify
    <<if4 Fields hidden>>
        // This model has at least 4 hidden fields
    <<elseif2 Fields label or boolean>>
        // This model has at least 2 label or boolean fields
    <<else>>
        // Something else
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<?4 F hd>>
        // This model has at least 4 hidden fields
    <<??2 F lb+tB>>
        // This model has at least 2 label or boolean fields
    <<??>>
        // Something else
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.fields.filter(f => f.hidden).length >= 4) {
        out += '    // This model has at least 4 hidden fields';
    } else if (root.fields.filter(f => f.label || f.type === 'boolean').length >= 2) {
        out += '    // This model has at least 2 label or boolean fields';
    } else {
        out += '    // Something else';
    }
    ```

### Conditions on the data models

#### Test a single data model

In a template of type `one model`:

=== "Hapify (long)"

    ```hapify
    <<if Model isGeolocated>>
      // This block is reached if the model is geolocated.
      // that's means it has at least one latitude field and one longitude field
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? M pGeo>>
      // This block is reached if the model is geolocated.
      // that's means it has at least one latitude field and one longitude field
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.properties.isGeolocated) {
        out += '    // ...';
    }
    ```

#### Test a list of data models

In a template of type `all models` :

=== "Hapify (long)"

    ```hapify
    <<if Models not onlyGuest>>
      // This block is reached if at least one model has not only guest actions
      import 'session-service';
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? M !pOGs>>
      // This block is reached if at least one model has not only guest actions
      import 'session-service';
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.filter(m => !m.accesses.properties.onlyGuest).length > 0) {
        out += "    import 'session-service';";
    }
    ```

### Available objects and filters

#### Root object

`Model` or `Models` ( short: `M`) refer to the main object:

- the data model in a template of type `one model`
- the array of data models in a template of type `all models`.

#### Filterable and testable objects

In the case of a template of type `one model`:

-   `Fields` (alias: `F`) is the list of fields
-   `Dependencies` (alias: `D`) is the list of dependencies (list of data models)
-   `ReferencedIn` (alias: `RefModels`, `R`) is the list of data models that depend on it
-   `PrimaryField` (alias: `P`) is the primary field of the model
-   `Accesses` (alias: `A`) is the list of accesses
-   `CreateAccess` (alias: `Ac`) is the access to the create action
-   `ReadAccess` (alias: `Ar`) is the access to the read action
-   `UpdateAccess` (alias: `Au`) is the access to the update action
-   `RemoveAccess` (alias: `Ad`) is the access to the delete action
-   `SearchAccess` (alias: `As`) is the access to the search action
-   `CountAccess` (alias: `An`) is the access to the count action

#### Filtering on field attributes

Available attributes for a field:

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
    -   `oneOne` (short: `tEoo`) for type `entity` and subtype `oneOne`
    -   `oneMany` (short: `tEom`) for type `entity` and subtype `oneMany`
    -   `manyOne` (short: `tEmo`) for type `entity` and subtype `manyOne`
    -   `manyMany` (short: `tEmm`) for type `entity` and subtype `manyMany`
-   `object` (short: `tO`) for type `object`
-   `file` (short: `tF`) for type `file`
    -   `image` (short: `tFi`) for type `file` and subtype `image`
    -   `video` (short: `tFv`) for type `file` and subtype `video`
    -   `audio` (short: `tFa`) for type `file` and subtype `audio`
    -   `document` (short: `tFd`) for type `file` and subtype `document`

**Example**

=== "Hapify (long)"

    ```hapify
    <<if Fields (restricted or internal) and not number>>
        // Current model has at least one field matching to the condition
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? F (rs+in)/tN>>
        // Current model has at least one field matching to the condition
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.fields.filter(f => (f.restricted || f.internal) && !f.number).length > 0) {
        out += "    // ...";
    }
    ```

#### Filtering on data model properties

Properties available for a data model:

-   `mainlyHidden` (short: `pMHd`) most of the fields are hidden (strictly)
-   `mainlyInternal` (short: `pMIn`) most of the fields are internal (strictly)
-   `isGeolocated` (short: `pGeo`) the model contains at least one `latitude` field and one `longitude` field
-   `isGeoSearchable` (short: `pGSe`) the model contains at least one searchable `latitude` field and one searchable `longitude` field

**Example**

=== "Hapify (long)"

    ```hapify
    <<if Model isGeolocated>>
        // This model contains at least one latitude field and one longitude field.
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? M pGeo>>
        // This model contains at least one latitude field and one longitude field.
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.properties.isGeolocated) {
        out += "    // ...";
    }
    ```

Access properties available for a data model:

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

**Example**

=== "Hapify (long)"

    ```hapify
    <<if Model onlyAdmin>>
        // All actions on this model are restricted to admins
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? M pOAd>>
        // All actions on this model are restricted to admins
    <<?>>
    ```
    
=== "JavaScript equivalent"

    ```javascript
    if (root.accesses.properties.onlyAdmin) {
        out += "    // ...";
    }
    ```

#### Filtering on data model access

!!! info "Reminder"
    `guest` is the most permissive access and `admin` the least permissive. Therefore `admin < owner < authenticated < guest`.

Filters available for action access:

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

**Exemples**

Tests access for a specific action:

=== "Hapify (long)"

    ```hapify
    <<if ReadAccess guest>>
        // Anyone can read this model
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? Ar gs>>
        // Anyone can read this model
    <<?>>
    ```

=== "JavaScript equivalent"

    ```javascript
    if (root.accesses.read.guest) {
        out += '    // ...';
    }
    ```

Checks if the update action is restricted to either the administrators or the owner:

=== "Hapify (long)"

    ```hapify
    <<if UpdateAccess admin or owner>>
        // ...
    <<endif>>
    ```
    
=== "Hapify (short)"

    ```hapify
    <<? Au ad+ow>>
        // ...
    <<?>>
    ```

=== "JavaScript equivalent"

    ```javascript
    if (root.accesses.update.admin || root.accesses.update.owner) {
        out += '    // ...';
    }
    ```
    
Tests whether at least one action is restricted to one or fewer authenticated users:

=== "Hapify (long)"

    ```hapify
    <<if Accesses lteAuth>>
        // ...
    <<endif>>
    ```
    
=== "Hapify (short)"

    ```hapify
    <<? A au]>>
        // ...
    <<?>>
    ```

=== "JavaScript equivalent"

    ```javascript
    if (root.accesses.filter(a => a.lteAuth).length > 0) {
        out += '    // ...';
    }
    ```
    
!!! tip "Tip"
    Conditions can be applied to an object or an array of objects.
    If applied to an array, it will test the length of the array filtered by the provided condition.
    It can be used on any object containing a `filter` method that receives a callback returning a boolean.
    For example, in the data model structure, `root.dependencies` is an object that contains a `filter` method.
    Thus, this operator can test whether a model has dependencies that have fields with a specific condition.

## Iterations

Iterations use the same filters and operators as conditions.

### Simple iteration

Loops over all the fields in a data model that are not hidden and assigns them to the `field` variable:

=== "Hapify (long)"

    ```hapify
    <?php
    $fields = array(
    <<for Fields not hidden field>>
        '<<field camel>>',
    <<endfor>>
    );
    ```

=== "Hapify (short)"

    ```hapify
    <?php
    $fields = array(
    <<@ F !hd f>>
        '<<f aA>>',
    <<@>>
    );
    ```

=== "JavaScript equivalent"

    ```javascript
    out += `<?php
    $fields = array(
        ${
        root.fields
            .filter(f => !f.hidden)
            .map(f => "'"+f.names.camel+"'")
            .join(",\n\t")
        }
    );`;
    ```

Example for a data model with fields `name`, `created at` and `role`, where `role` is hidden:

```php
<?php
$fields = array(
    'name',
    'createdAt',
);
```

Loops over the `entity` and searchable fields of the data model:

=== "Hapify (long)"

    ```hapify
    <<for Fields searchable and entity field>>
        // ...
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ F se*tE f>>
        // ...
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let field of root.fields.filter(f => f.searchable && f.type === 'entity')) {
        out += '    // ...';
    }
    ```
    
#### Loop without filtering

This operation allows you to loop through all the fields:

=== "Hapify (long)"

    ```hapify
    <<for Fields field>>
        // ...
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ F f>>
        // ...
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let field of root.fields.list) {
        out += '    // ...';
    }
    ```
    
#### Loop through data models

In a template of type `all models`, this loops through all the data models that are geo-located:

=== "Hapify (long)"

    ```hapify
    <<for Models isGeolocated model>>
        // ...
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ M pGeo m>>
        // ...
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let model of root.filter(i => i.properties.isGeolocated)) {
        out += '    // ...';
    }
    ```
    
#### Loop through dependencies.
    
In a template of type `one model`, this loops through the dependencies whose referent field is searchable:

=== "Hapify (long)"

    ```hapify
    <<for Dependencies searchable dep>>
        // ...
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ D se d>>
        // ...
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let dep of root.dependencies.filter(f => f.searchable)) {
        out += '    // ...';
    }
    ```
    
!!! tip "Tip"
    In the case of a self-referencing data model, `Dependencies` excludes this self-dependency.
    To include it use the following code:
    ```hapify
    <<< for (let dep of root.dependencies.filter(f => f, false)) { >>>
        // ...
    <<< } >>>
    ```
    
!!! warning "Warning"
    Filtering of `Dependencies` is performed only on the fields of the current data model that carry the reference.
    Filtering is **not** performed on the fields of the target data model.
    
#### Loop through referring data models
    
In a template of type `one model`, this loops through the data models that have a dependency on it and that are geo-located:

=== "Hapify (long)"

    ```hapify
    <<for ReferencedIn isGeolocated referrer>>
        // ...
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ R pGeo r>>
        // ...
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let referrer of root.referencedIn.filter(m => m.properties.isGeolocated)) {
        out += '    // ...';
    }
    ```
    
!!! tip "Tip"
    The filter is optional. You can get all the referring data models like this:
    ```hapify
    <<for ReferencedIn referrer>>
        // ...
    <<endfor>>
    ```
    
!!! warning "Warning"
    Only referenced entity fields are defined in these referring data models.
    
#### Loop through the accesses of the data model

Loops through all accesses restricted to an administrator or owner and displays the name of the action:

=== "Hapify (long)"

    ```hapify
    <<for Accesses admin or owner access>>
        <<=access.action>>
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ A ad+ow a>>
        <<=a.action>>
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let access of root.accesses.filter(a => a.admin || a.owner)) {
        out += `    ${access.action}\n`;
    }
    ```

### Shortened iteration

Loop through the first 2 fields of a data model :

=== "Hapify (long)"

    ```hapify
    <?php
    $fields = array(
    <<for2 Fields field>>
        '<<field camel>>',
    <<endfor>>
    );
    ```

=== "Hapify (short)"

    ```hapify
    <?php
    $fields = array(
    <<@2 F f>>
        '<<f aA>>',
    <<@>>
    );
    ```

=== "JavaScript equivalent"

    ```javascript
    out += `<?php
    $fields = array(
        ${
        root.fields.list
            .slice(0, 2)
            .map(f => "'"+f.names.camel+"'")
            .join(",\n\t")
        }
    );`;
    ```

For a data model with fields `name`, `email` and `role`:

```php
<?php
$fields = array(
    'name',
    'email',
);
```

### Nested iterations

#### Loop through the enums

In a template of type `one model`, this block defines a TypeScript type containing the enums of a field:

=== "Hapify (long)"

    ```hapify
    <<for Fields enum field>>
    type <<field pascal>> =<<for field.enum e>> | '<<e snake>>'<<endfor>>;
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ F tU f>>
    type <<f AA>> =<<@ f.e e>> | '<<e a_a>>'<<@>>;
    <<@>>
    ```

=== "JavaScript equivalent"

    ```javascript
    for (let field of root.fields.filter(f => f.type === 'enum')) {
        out += `type ${field.names.pascal} = ${field.enum.map(e => "'"+e.names.snake+"'").join(' | ')};`;
    }
    ```

=== "Output"

    ```javascript
    type Role = | 'admin' | 'user' | 'customer';
    ```

#### Loop through the fields of all data models

In a template of type `all models`, this block loops through all the fields of all the data models:

=== "Hapify (long)"

    ```hapify
    const models = {
    <<for Models model>>
        <<m camel>>: [
        <<for model.fields field>>
            '<<field camel>>',
        <<endfor>>
        ],
    <<endfor>>
    }
    ```

=== "Hapify (short)"

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

=== "Output"

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

## Raw input and interpolation

This operator allows you to write pure JavaScript.

### Custom variable

Defines a custom variable and adds it to the output:

```hapify
<<< const length = root.fields.length; >>>

// This model has <<=length>> fields
```

### Custom function

Defines a custom function and calls it:

=== "Hapify (long)"

    ```hapify
    <<<
    function fieldName(field) {
        return field.names.snake.replace('_', ':');
    }
    >>>
    <<for Fields field>>
    <<=fieldName(field)>>
    <<endfor>>
    ```

=== "Hapify (short)"

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

=== "Output"

    ```
    id
    created:at
    place:category
    ```

### Custom condition or iteration

This block allows you to write a condition that is not handled by the Hapify syntax:

```hapify
<<< if (root.fields.hidden.length < 3 || root.properties.mainlyInternal) { >>>
// ...
<<< } >>>
```

!!! tip "Tip"
    In a Hapify template of type `one model`, the `root` variable refers to the data model.
    In a Hapify template of type `all models`, the `root` variable refers to the array of data models.

!!! seealso "See also"
    For detailed information on the structure of the data model, see [the model object](./model-object.md).

## Error

Do not write this: `#!hapify <<= JSON.stringify(root) >>`.
The `root` object has recursive properties. Therefore, this command will lead to an infinite loop.

## Comments

This syntax writes a comment to the template without any output to the generated file.

```hapify
<<# This is just a comment>>
```

## Escaping

It is possible to escape the tags of the Hapify syntax with the character `\`:

=== "Hapify"

    ```hapify
    $val = 4;
    $res = $val \<\< 3;
    $res = 4 \>\> $val;
    ```

=== "Output"

    ```php
    $val = 4;
    $res = $val << 3;
    $res = 4 >> $val;
    ```

## Formatting

Empty lines and lines containing only condition or iteration meta-code are automatically deleted after generation.
To force the generator to keep an empty line, insert one or more spaces at the beginning of it.

!!! warning "Warning"
    Hapify does not format the generated code, since the formatting rules are specific to each language or framework.
    We strongly recommend you to use a code formatter after the generation.

## Reserved words

The following list of words cannot be used to name variables.

`A`, `Ac`, `Accesses`, `Ad`, `An`, `Ar`, `As`, `Au`, `CountAccess`, `CreateAccess`, `D`, `Dependencies`, `F`, `Fields`, `M`, `Model`, `Models`, `P`, `PrimaryField`, `R`, `ReadAccess`, `RefModels`, `ReferencedIn`, `RemoveAccess`, `SearchAccess`, `UpdateAccess`, `ad`, `admin`, `and`, `andNot`, `au`, `audio`, `auth`, `boolean`, `date`, `datetime`, `document`, `else`, `elseif`, `em`, `email`, `embedded`, `endfor`, `endif`, `entity`, `enum`, `file`, `float`, `for`, `gs`, `gteAdmin`, `gteAuth`, `gteGuest`, `gteOwner`, `guest`, `hd`, `hidden`, `if`, `image`, `in`, `integer`, `internal`, `isGeoSearchable`, `isGeolocated`, `label`, `latitude`, `lb`, `longitude`, `lteAdmin`, `lteAuth`, `lteGuest`, `lteOwner`, `mainlyHidden`, `mainlyInternal`, `manyMany`, `manyOne`, `maxAdmin`, `maxAuth`, `maxGuest`, `maxOwner`, `ml`, `multiple`, `noAdmin`, `noAuth`, `noGuest`, `noOwner`, `not`, `nu`, `nullable`, `number`, `object`, `oneMany`, `oneOne`, `onlyAdmin`, `onlyAuth`, `onlyGuest`, `onlyOwner`, `or`, `orNot`, `os`, `out`, `ow`, `owner`, `ownership`, `pGSe`, `pGeo`, `pMAd`, `pMAu`, `pMGs`, `pMHd`, `pMIn`, `pMOw`, `pNAd`, `pNAu`, `pNGs`, `pNOw`, `pOAd`, `pOAu`, `pOGs`, `pOOw`, `password`, `pr`, `primary`, `restricted`, `rich`, `richText`, `root`, `rs`, `se`, `searchable`, `so`, `sortable`, `string`, `tB`, `tD`, `tDd`, `tDt`, `tE`, `tEmm`, `tEom`, `tEoo`, `tF`, `tFa`, `tFd`, `tFi`, `tFv`, `tN`, `tNf`, `tNg`, `tNi`, `tNt`, `tO`, `tS`, `tSe`, `tSp`, `tSr`, `tSt`, `tSu`, `tU`, `text`, `time`, `un`, `unique`, `url`, `video`.
