# Code samples

This document shows code samples in order to help you play with the Hapify syntax like a boss.

## Pre-requisites

Before reading this article, we recommend that you read the documentation about [Hapify syntax](/documentation/templating-hapify).

## Names

### Create a class for the current model

This block creates a class for the model (in pascal case) and set the name of the primary key, in snake case.

```
class <<M AA>> {
    private primaryKey = '<<P a_a>>';
}
```

## Conditions

### Include dependencies depending on fields properties

In a single model template, this block requires MongoDb driver if the model has a relation to another one.

```
<<? F tE>>
const mongoDb = require('mongodb');
<<?>>
```

### Includes session validation if the action requires authentication

In a single model template, if the action `create` requires at least an authenticated user, this block get the connected user.

```
<<? Ac [au>>
const user = Session.getCurrent();
<<?>>
```

### Test if the model is geo-located

In a single model template, if the model has the property `isGeolocated` (i.e. if the model contains at least one latitude field and one longitude field),
this block calls the map position picker component.

```
<<? M pGeo>>
<app-map-position-picker [model]="<<M aA>>"></app-map-position-picker>
<<?>>
```

## Iterations

### Populate an array with all hidden fields' name

In a single model template, this block creates an array (in Javascript) that contains the hidden (`hd`) fields' names (in camel case).

```
const hiddenFields = [
<<@ F hd f>>
    '<<f aA>>',
<<?>>
];
```

### Create an index file that includes all models

In a multiple model template, this will call all model's index file.

```
<<@ M m>>
require_once('./<<m a-a>>.php'),
<<@>>
```

### Create an index file that includes models accessible by admins only

If you want to restrict the previous loop for models that only contains admin actions:

```
<<@ M pOAd m>>
require_once('./<<m a-a>>.php'),
<<@>>
```

### Define a default value depending on data type for internal fields

In a single model template, this block assigns a value to the field depending on its type for all internal (`in`) fields.
If the type of the field is `boolean` it assigns `false`, if the type is `string` it assigns `''`, if the type is `number` it assigns `0`, else it assigns `NULL`
This template outputs PHP.

```
<<@ F in f>>
    <<? f tB>>
$value = false;
    <<?? f tS>>
$value = '';
    <<?? f tN>>
$value = 0;
    <<??>>
$value = NULL;
    <<?>>
<<@>>
```

### Requires all dependencies

In a single model template, this block requires other models pointed by entity fields.
If the model as a self-dependency, it won't be included in the loop.

```
<<@ D d>>
import {<<d AA>>} from '../<<d a-a>>';
<<@>>
```

You can also filter models by fields properties. This block excludes models that contains hidden fields:

```
<<@ D !hd d>>
import {<<d AA>>} from '../<<d a-a>>';
<<@>>
```

### Cascading deletion

In a single model template, this block lists all models that refer to the current one and delete them.
The first iteration loops over all models that have dependency to this one.
The second iteration loops over all entity relations contained in those dependant models.

```
<<@ R m>>
    <<@ m.f f>>
await db.collection('<<m AA>>').deleteMany({ <<f a_a>>: id });
    <<@>>
<<@>>
```
