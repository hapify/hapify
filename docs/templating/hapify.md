# Hapify templating

## Why using a specific syntax ?

We designed a syntax to manipulate the [object](/templating/javascript) injected in the templates that represents the data-model.
This syntax is optimized to play with this object's properties with short words.
This allow us to deal with complex ideas with short sentences.

For example, this loop in Javascript:

```javascript
for (let f of root.fields.list.filter(f => f.searchable && f.type === 'entity')) {
	out += '    Do something';
}
```

Will be written like this with Hapify syntax:

```
<<@ F se*tE f>>
    Do something
<<@>>
```

## Names

### Model names

In a single model template:

```
// Create a new <<M a>>
const <<M aA>> = new <<M AA>>();
```

For a model named `user group`, this will output:

```javascript
// Create a new user group
const userGroup = new UserGroup();
```


### Field names

List all fields in a model

```
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

-   `aA` for `camelCase`
-   `AA` for `PascalCase`
-   `a` for `lower case`
-   `A` for `Capital Case`
-   `a-a` for `kebab-case`
-   `A-A` for `Header-Case`
-   `a_a` for `snake_case`
-   `A_A` for `CONSTANT_CASE`
-   `aa` for `compactcase`
-   `R` (raw) for the original name

## Conditions

### Single condition

```
const utils = require('utils');
<<? F tE>>
const mongoDb = require('mongodb');
<<?>>
```

For a model that contains at least one entity field, this will output:

```javascript
const utils = require('utils');
const mongoDb = require('mongodb');
```

For a model that contains no entity field, this will output:

```javascript
const utils = require('utils');
```

### Alternative conditions

```
<<? F tE>>
  // At least one entity field
<<?? F hd>>
  // No entity field and at least one hidden field
<<??>>
  // No entity field and no hidden field
<<?>>
```

### Complex condition

#### Operators

Operators available to write conditions are:

- `*` is the AND operator. `a * b` is equivalent to `a && b`.
- `/` is the AND NOT operator. `a / b` is equivalent to `a && !b`.
- `+` is the OR operator. `a + b` is equivalent to `a || b`.
- `-` is the OR NOT operator. `a - b` is equivalent to `a || !b`.

Example:

```
<<? F tE*hd+un/ml>>
  // This code block is reached if the model has at least one field that validates this conditions:
  // (type entity AND hidden) OR (unique AND NOT multiple)
<<?>>
```

Conditions can also be written with native operators.
Let's rewrite the last one:

```
<<? F (tE && hd) || (un && !ml) >>
  // This code block is reached if the model has at least one field that validates this conditions:
  // (type entity AND hidden) OR (unique AND NOT multiple)
<<?>>
```

#### Conditions on occurrences

```
<<?3 F tSp>>
  // This block is reach if at least one model has at least 3 password field
<<?>>
```

### Conditions over models

#### Test a single model

In a single model template.

```
<<? M pGeo>>
  // This block is reached if the model is geolocated.
  // that's means it has at least one latitude field and one longitude field
<<?>>
```

#### Test a list of models

In a multiple model template.

```
<<? M !pOGs>>
  // This block is reached if at least one model has not only guest actions
  import 'session-service';
<<?>>
```

### Available objects & filters

#### Root object

`M` refers to the top object: the model in a single model template or the array of models in a multiple model template.

#### Filterable and testable objects

In case of a single model template:

-   `F` is the fields list
-   `D` is the dependencies list (models list)
-   `R` is the models list that depend from this one
-   `P` is the models primary field
-   `A` is the action's accesses list
-   `Ac` is the create action's access
-   `Ar` is the read action's access
-   `Au` is the update action's access
-   `Ad` is the delete (remove) action's access
-   `As` is the search action's access
-   `An` is the count action's access

#### Filtering on field properties

Short-codes available for a field:

-   `pr` for `primary`
-   `un` for `unique`
-   `lb` for `label`
-   `nu` for `nullable`
-   `ml` for `multiple`
-   `em` for `embedded`
-   `se` for `searchable`
-   `so` for `sortable`
-   `hd` for `hidden`
-   `in` for `internal`
-   `rs` for `restricted`
-   `os` for `ownership`
-   `tS` for type `string`
    -   `tSe` for type `string` and subtype `email`
    -   `tSp` for type `string` and subtype `password`
    -   `tSu` for type `string` and subtype `url`
    -   `tSt` for type `string` and subtype `text`
    -   `tSr` for type `string` and subtype `rich`
-   `tN` for type `number`
    -   `tNi` for type `number` and subtype `integer`
    -   `tNf` for type `number` and subtype `float`
    -   `tNt` for type `number` and subtype `latitude`
    -   `tNg` for type `number` and subtype `longitude`
-   `tB` for type `boolean`
-   `tD` for type `datetime`
    -   `tDd` for type `datetime` and subtype `date`
    -   `tDt` for type `datetime` and subtype `time`
-   `tE` for type `entity`
-   `tO` for type `object`
-   `tF` for type `file`
    -   `tFi` for type `file` and subtype `image`
    -   `tFv` for type `file` and subtype `video`
    -   `tFa` for type `file` and subtype `audio`
    -   `tFd` for type `file` and subtype `document`

#### Filtering on model properties

Short-codes available for the properties of a model:

-   `pMHd` most of the fields are hidden (strictly)
-   `pMIn` most of the fields are internal (strictly)
-   `pGeo` the model contains at least one latitude field and one longitude field
-   `pGSe` the model contains at least one searchable latitude field and one searchable longitude field

Short-codes available for the access' properties of a model:

-   `pOAd` the model only contains actions restricted to `admin`
-   `pOOw` the model only contains actions restricted to `owner`
-   `pOAu` the model only contains actions restricted to `authenticated`
-   `pOGs` the model only contains actions restricted to `guest`
-   `pMAd` the most permissive access is `admin`
-   `pMOw` the most permissive access is `owner`
-   `pMAu` the most permissive access is `authenticated`
-   `pMGs` the most permissive access is `guest`
-   `pNAd` there is no action restricted to `admin`
-   `pNOw` there is no action restricted to `owner`
-   `pNAu` there is no action restricted to `authenticated`
-   `pNGs` there is no action restricted to `guest`

#### Filtering on action accesses

Short-codes available for the access of an action:

-   `ad` the selected access is `admin`
-   `ow` the selected access is `owner`
-   `au` the selected access is `auth`
-   `gs` the selected access is `guest`
-   `[ad` the selected access is greater or equal than `admin`
-   `[ow` the selected access is greater or equal than `owner`
-   `[au` the selected access is greater or equal than `auth`
-   `[gs` the selected access is greater or equal than `guest`
-   `ad]` the selected access is less or equal than `admin`
-   `ow]` the selected access is less or equal than `owner`
-   `au]` the selected access is less or equal than `auth`
-   `gs]` the selected access is less or equal than `guest`

## Iterations

Iterations uses the same operators as conditions.

### Simple iteration

Loop over all fields of a model that are not hidden and assign them to variable `f`.

```
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

Loop over the 2 first fields of a model

```
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

In a multiple model template, this will loop over all fields of all models:

```
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

This will generate something like this:

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

```
<<< const length = model.fields.length; >>>

// This model has <<=length>> fields
```

### Custom function

Define a custom function and call it

```
<<<
function fieldName(f) {
    return f.names.snake.replace('_', ':');
}
>>>
<<@ F f>>
<<=fieldName(f)>>
<<@>>
```

This will output something like this

```
id
created:at
place:category
```

### Error

Do not write this: `<<= JSON.stringify(root) >>`.
The `root` object has recursive properties. Therefore this command will enter an infinite loop.

## Comments

This syntax writes a comment in the template without any output to the generated file.

```
<<# This is just a comment>>
```

## Learn more

If you want to learn more about Hapify syntax and how it is mapped to the [JavaScript object](/templating/javascript) injected in the templates, please refer to the documentation [syntax detailed](/documentation/syntax).
