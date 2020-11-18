# Code samples

This document shows code samples in order to help you play with the Hapify syntax like a king.

## Pre-requisites

Before reading this article, we recommend that you read the documentation about [Hapify syntax](../syntax).

## Names

### Create a class for the current model

This block creates a class for the model (in pascal case) and sets the name of the primary key, in snake case.

=== "Long syntax"

    ```hapify
    class <<Model pascal>> {
        private primaryKey = '<<PrimaryField snake>>';
    }
    ```

=== "Short syntax"

    ```hapify
    class <<M AA>> {
        private primaryKey = '<<P a_a>>';
    }
    ```
    
=== "Sample output"

    ```typescript
    class Place {
        private primaryKey = '_id';
    }
    ```

## Conditions

### Include dependencies depending on field properties

In a single-model template, this block requires the MongoDb driver if the model has a relation to another one.

=== "Long syntax"

    ```hapify
    <<if Fields entity>>
    const mongoDb = require('mongodb');
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? F tE>>
    const mongoDb = require('mongodb');
    <<?>>
    ```
    
=== "Sample output"

    ```javascript
    const mongoDb = require('mongodb');
    ```

### Include session validation if the action requires authentication

In a single-model template, if the action `create` requires at least an authenticated user, this block gets the connected user.

=== "Long syntax"

    ```hapify
    <<if CreateAccess gteAuth>>
    const user = Session.getCurrent();
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? Ac [au>>
    const user = Session.getCurrent();
    <<?>>
    ```
    
=== "Sample output"

    ```javascript
    const user = Session.getCurrent();
    ```

### Test if the model is geo-located

In a single-model template, if the model has the property `isGeolocated` (i.e. if the model contains at least one latitude field and one longitude field),
this block calls the map position picker component.

=== "Long syntax"

    ```hapify
    <<if Model isGeolocated>>
    <app-map-position-picker [model]="<<Model camel>>"></app-map-position-picker>
    <<endif>>
    ```

=== "Short syntax"

    ```hapify
    <<? M pGeo>>
    <app-map-position-picker [model]="<<M aA>>"></app-map-position-picker>
    <<?>>
    ```
    
=== "Sample output"

    ```html
    <app-map-position-picker [model]="place"></app-map-position-picker>
    ```

## Iterations

### Populate an array with all hidden field names

In a single-model template, this block creates an array (in Javascript) that contains the hidden (`hd`) field names (in camel case).

=== "Long syntax"

    ```hapify
    const hiddenFields = [
    <<for Fields hidden f>>
        '<<f camel>>',
    <<endif>>
    ];
    ```

=== "Short syntax"

    ```hapify
    const hiddenFields = [
    <<@ F hd f>>
        '<<f aA>>',
    <<?>>
    ];
    ```
    
=== "Sample output"

    ```javascript
    const hiddenFields = [
        'password',
        'token',
    ];
    ```

### Create an index file that includes all models

In a multiple-model template, this will call all models' index files.

=== "Long syntax"

    ```hapify
    <<for Models m>>
    require_once('./<<m kebab>>.php'),
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ M m>>
    require_once('./<<m a-a>>.php'),
    <<@>>
    ```
    
=== "Sample output"

    ```php
    require_once('./user.php'),
    require_once('./place.php'),
    require_once('./service.php'),
    require_once('./place-category.php'),
    ```

### Create an index file that includes models accessible by admins only

If you want to restrict the previous loop for models that only contain admin actions:

=== "Long syntax"

    ```hapify
    <<for Models onlyAdmin m>>
    require_once('./<<m kebab>>.php'),
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ M pOAd m>>
    require_once('./<<m a-a>>.php'),
    <<@>>
    ```
    
=== "Sample output"

    ```php
    require_once('./menu.php'),
    require_once('./menu-part.php'),
    require_once('./menu-item.php'),
    require_once('./order.php'),
    ```

### Define a default value depending on data type for internal fields

In a single-model template, this block assigns a value to the field depending on its type for all internal (`in`) fields.
If the type of the field is `boolean` it assigns `false`, if the type is `string` it assigns `''`, if the type is `number` it assigns `0`, else it assigns `NULL`.
This template outputs PHP.

=== "Long syntax"

    ```hapify
    <<for Fields internal f>>
        <<if f boolean>>
    $default<<f pascal>> = false;
        <<elseif f string>>
    $default<<f pascal>> = '';
        <<elseif f number>>
    $default<<f pascal>> = 0;
        <<else>>
    $default<<f pascal>> = NULL;
        <<endif>>
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F in f>>
        <<? f tB>>
    $default<<f AA>> = false;
        <<?? f tS>>
    $default<<f AA>> = '';
        <<?? f tN>>
    $default<<f AA>> = 0;
        <<??>>
    $default<<f AA>> = NULL;
        <<?>>
    <<@>>
    ```
    
=== "Sample output"

    ```php
    $defaultId = '';
    $defaultCreatedAt = NULL;
    $defaultStock = 0;
    ```

### Requires all dependencies

In a single-model template, this block requires other models pointed by entity fields.
If the model has a self-dependency, it won't be included in the loop.

=== "Long syntax"

    ```hapify
    <<for Dependencies d>>
    import {<<d pascal>>} from '../<<d kebab>>';
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ D d>>
    import {<<d AA>>} from '../<<d a-a>>';
    <<@>>
    ```

=== "Sample output"

    ```typescript
    import {Restaurant} from '../restaurant';
    import {User} from '../user';
    import {MenuPart} from '../menu-part';
    import {MenuItem} from '../menu-item';
    ```

You can also filter models by field properties. This block excludes models that contain hidden fields:

=== "Long syntax"

    ```hapify
    <<for Dependencies not hidden dep>>
    import {<<dep pascal>>} from '../<<dep kebab>>';
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ D !hd d>>
    import {<<d AA>>} from '../<<d a-a>>';
    <<@>>
    ```

=== "Sample output"

    ```typescript
    import {PlaceCategory} from '../place-category';
    import {Service} from '../service';
    import {User} from '../user';
    ```

### Cascading deletion

In a single-model template, this block lists all models that refer to the current one and deletes them.
The first iteration loops over all models that have dependency to this one.
The second iteration loops over all entity relations contained in those dependent models.

=== "Long syntax"

    ```hapify
    <<@ ReferencedIn model>>
        <<for model.fields field>>
    await db.collection('<<model pascal>>').deleteMany({ <<field snake>>: id });
        <<endfor>>
    <<@>>
    ```

=== "Short syntax"

    ```hapify
    <<@ R m>>
        <<@ m.f f>>
    await db.collection('<<m AA>>').deleteMany({ <<f a_a>>: id });
        <<@>>
    <<@>>
    ```

=== "Sample output"

    ```javascript
    await db.collection('Place').deleteMany({ owner: id });
    await db.collection('Bookmark').deleteMany({ owner: id });
    await db.collection('Message').deleteMany({ sender: id });
    await db.collection('Message').deleteMany({ recipient: id });
    await db.collection('Conversation').deleteMany({ participants: id });
    await db.collection('Conversation').deleteMany({ closed_by: id });
    await db.collection('ConversationReport').deleteMany({ complainant: id });
    await db.collection('ConversationReport').deleteMany({ defendant: id });
    ```
