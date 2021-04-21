## Introduction

This section presents typical use cases for templates. Each code example is provided with the following template engines:

- Hapify (long and short syntaxes)
- EJS
- JavaScript

For full details of the Hapify syntax, please refer to [this article](../../reference/hapify-syntax.md).

To learn about the EJS syntax, please refer to the [official documentation](https://ejs.co/#docs).

!!! warning "Warning"
    All EJS features are available, except the `include` feature.
    This feature is intentionally disabled so that templates do not have access to your file system.

### Data model manipulation

Templates receive as input the [model object](../../reference/model-object.md). This object, injected in the templates, describes the data model and all its properties and relations, so that they are easily accessible from the template.

We recommend that you understand its structure before you start writing templates.

## Code examples

### Names

#### Create a class for the current data model

This block creates a class for the data model (in `pascal` case) and defines the primary key name, in `snake` case.

=== "Hapify (long)"

    ```hapify
    class <<Model pascal>> {
        private primaryKey = '<<PrimaryField snake>>';
    }
    ```

=== "Hapify (short)"

    ```hapify
    class <<M AA>> {
        private primaryKey = '<<P a_a>>';
    }
    ```

=== "EJS"

    ```js
    class <%= model.names.pascal %> {
        private primaryKey = '<%= model.fields.primary.names.snake %>';
    }
    ```

=== "JavaScript"

    ```javascript
    return `class ${model.names.pascal} {
        private primaryKey = '${model.fields.primary.names.snake}';
    }`;
    ```

=== "Output"

    ```typescript
    class Place {
        private primaryKey = '_id';
    }
    ```

### Conditions

#### Include dependencies based on field attributes

In a template of type `one model`, this block imports the MongoDB driver if the data model has a relationship with another.

=== "Hapify (long)"

    ```hapify
    <<if Fields entity>>
    const mongoDb = require('mongodb');
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? F tE>>
    const mongoDb = require('mongodb');
    <<?>>
    ```

=== "EJS"

    ```js
    <% if (model.fields.filter(f => f.type === 'entity').length > 0) { -%>
    const mongoDb = require('mongodb');
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    if (model.fields.filter(f => f.type === 'entity').length > 0) {
        output += `const mongoDb = require('mongodb');`
    }
    return output;
    ```

=== "Output"

    ```javascript
    const mongoDb = require('mongodb');
    ```

#### Validate the session if the operation requires authentication

In a template of type `one model`, if the `create` action requires at most one authenticated user, this block retrieves the logged in user.

!!! info "Reminder"
    `guest` is the most permissive access and `admin` the least permissive. Therefore `admin < owner < authenticated < guest`.

=== "Hapify (long)"

    ```hapify
    <<if CreateAccess lteAuth>>
    const user = Session.getCurrent();
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? Ac au]>>
    const user = Session.getCurrent();
    <<?>>
    ```

=== "EJS"

    ```js
    <% if (model.accesses.create.lteAuth) { -%>
    const user = Session.getCurrent();
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    if (model.accesses.create.lteAuth) {
        output += `const user = Session.getCurrent();`
    }
    return output;
    ```

=== "Output"

    ```javascript
    const user = Session.getCurrent();
    ```

#### Test if the data model is geolocated

In a template of type `one model`, if the data model has the property `isGeolocated` (i.e. if the data model contains at least one latitude field and one longitude field)
this block imports the map position selection component.

=== "Hapify (long)"

    ```hapify
    <<if Model isGeolocated>>
    <app-map-position-picker [model]="<<Model camel>>"></app-map-position-picker>
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? M pGeo>>
    <app-map-position-picker [model]="<<M aA>>"></app-map-position-picker>
    <<?>>
    ```

=== "EJS"

    ```js
    <% if (model.properties.isGeolocated) { -%>
    <app-map-position-picker [model]="<%= model.names.camel %>"></app-map-position-picker>
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    if (model.properties.isGeolocated) {
        output += `<app-map-position-picker [model]="${model.names.camel}"></app-map-position-picker>`
    }
    return output;
    ```

=== "Output"

    ```html
    <app-map-position-picker [model]="place"></app-map-position-picker>
    ```

#### Getting relationships based on cardinality

This example creates a method that retrieves entities from a store, depending on the type of relationship: `one-to-one`, `one-to-many` or `many-to-many`.

=== "Hapify (long)"

    ```hapify
    class <<Model pascal>> extends BaseModel {
    <<for Fields entity field>>
        get<<field pascal>>() {
        <<if field oneOne or oneMany>>
            return this.<<field.model camel>>Store.findOne(this.properties.<<field camel>>);
        <<elseif field manyMany>>
            return this.<<field.model camel>>Store.findMany(this.properties.<<field camel>>);
        <<endif>>
        }
    <<endfor>>
    }
    ```

=== "Hapify (short)"

    ```hapify
    class <<M AA>> extends BaseModel {
    <<@ F tE f>>
        get<<f AA>>() {
        <<? f tEoo + tEom>>
            return this.<<f.m aA>>Store.findOne(this.properties.<<f aA>>);
        <<?? f tEmm>>
            return this.<<f.m aA>>Store.findMany(this.properties.<<f aA>>);
        <<?>>
        }
    <<@>>
    }
    ```

=== "EJS"

    ```js
    class <%= model.names.pascal %> extends BaseModel {
    <% for (let field of model.fields.filter(f => f.type === 'entity')) { -%>
        get<%= field.names.pascal %>() {
        <% if (field.subtype === 'oneOne' || field.subtype === 'oneMany') { -%>
            return this.<%= field.model.names.camel %>Store.findOne(this.properties.<%= field.names.camel %>);
        <% } else if (field.subtype === 'manyMany') { -%>
            return this.<%= field.model.names.camel %>Store.findMany(this.properties.<%= field.names.camel %>);
        <% } -%>
        }
    <% } -%>
    }
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    output += `class ${model.names.pascal} extends BaseModel {
        ${getRelations()}
    }`;
    
    function getRelations() {
        return model.fields.filter(f => f.type === 'entity').reduce((acc, field) => {
            return acc + getRelation(field) + '\n\t';
        }, '');
    }
    
    function getRelation(field) {
        let method = '';
        if (field.subtype === 'oneOne' || field.subtype === 'oneMany') {
            method = 'findOne';
        } else if (field.subtype === 'manyMany') {
            method = 'findMany';
        } else {
            return '';
        }
        return `get${field.names.pascal}() {
            return this.${field.model.names.camel}Store.${method}(this.properties.${field.names.camel});
        }`;
    }
    
    return output;
    ```

=== "Output"

    ```typescript
    class User extends BaseModel {
        getAvatar() {
            return this.avatarStore.findOne(this.properties.avatar);
        }
        getBookmarks() {
            return this.placeStore.findMany(this.properties.bookmarks);
        }
    }
    ```


### Iterations

#### Fill an array with all hidden field names

In a template of type `one model`, this block creates an array (in JavaScript) that contains the names of `hidden` fields (in `camel` case).

=== "Hapify (long)"

    ```hapify
    const hiddenFields = [
    <<for Fields hidden field>>
        '<<field camel>>',
    <<endfor>>
    ];
    ```

=== "Hapify (short)"

    ```hapify
    const hiddenFields = [
    <<@ F hd f>>
        '<<f aA>>',
    <<@>>
    ];
    ```

=== "EJS"

    ```js
    const hiddenFields = [
    <% for (let field of model.fields.filter(f => f.hidden)) { -%>
        '<%= field.names.camel %>',
    <% } -%>
    ];
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    const hiddenFieldsNames = model.fields
        .filter(f => f.hidden)
        .map(f => `'${f.names.camel}'`);
    output += `const hiddenFields = [
        ${hiddenFieldsNames.join(",\n\t")}
    ];`;
    return output;
    ```

=== "Output"

    ```javascript
    const hiddenFields = [
        'password',
        'token',
    ];
    ```

#### Create an array containing all possible values of an enumeration

In a template of type `one model`, this block defines enumeration values as arrays (in `constant` case).

=== "Hapify (long)"

    ```hapify
    <<for Fields enum field>>
    const <<field camel>>Values = [
        <<for field.enum e>>
        '<<e constant>>',
        <<endfor>>
    ];
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ F tU f>>
    const <<f aA>>Values = [
        <<@ f.e e>>
        '<<e A_A>>',
        <<@>>
    ];
    <<@>>
    ```

=== "EJS"

    ```js
    <% for (let field of model.fields.filter(f => f.type === 'enum')) { -%>
    const <%= field.names.camel %>Values = [
        <% for (let e of field.enum) { -%>
        '<%= e.names.constant %>',
        <% } -%>
    ];
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let field of model.fields.filter(f => f.type === 'enum')) {
        const enums = field.enum.map(e => `'${e.names.constant}'`);
        output += `const ${field.names.camel}Values = [
        ${enums.join(',\n\t')}
    ];`;
    }
    return output;
    ```

=== "Output"

    ```javascript
    const roleValues = [
        'ADMIN',
        'USER',
        'CUSTOMER',
    ];
    const statusValues = [
        'BUSY',
        'AVAILABLE',
        'OUT_OF_OFFICE',
    ];
    ```

#### Create an index file of all models

In a template of type `all models`, this will call the files of all models.

=== "Hapify (long)"

    ```hapify
    <<for Models model>>
    require_once('./<<model kebab>>.php');
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ M m>>
    require_once('./<<m a-a>>.php');
    <<@>>
    ```

=== "EJS"

    ```js
    <% for (let model of models) { -%>
    require_once('./<%= model.names.kebab %>.php');
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let model of models) {
        output += `require_once('./${model.names.kebab}.php');\n`;
    }
    return output;
    ```

=== "Output"

    ```php
    require_once('./user.php');
    require_once('./place.php');
    require_once('./service.php');
    require_once('./place-category.php');
    ```

#### Create an index file with models accessible only by administrators

If you want to limit the previous loop for models that contain only admin operations :

=== "Hapify (long)"

    ```hapify
    <<for Models onlyAdmin model>>
    require_once('./<<model kebab>>.php');
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ M pOAd m>>
    require_once('./<<m a-a>>.php');
    <<@>>
    ```

=== "EJS"

    ```js
    <% for (let model of models.filter(m => m.accesses.properties.onlyAdmin)) { -%>
    require_once('./<%= model.names.kebab %>.php');
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let model of models.filter(m => m.accesses.properties.onlyAdmin)) {
        output += `require_once('./${model.names.kebab}.php');\n`;
    }
    return output;
    ```

=== "Output"

    ```php
    require_once('./menu.php');
    require_once('./menu-part.php');
    require_once('./menu-item.php');
    require_once('./order.php');
    ```

#### Set default value based on data type

In a template of type `one model`, this block assigns a value to the field based on its type for all `internal` fields.
If the type of the field is `boolean`, it assigns the value `false`, if the type is `string`, it assigns the value `''`, if the type is `number`, it assigns the value `0`, otherwise it assigns the value `NULL`.
This template generates PHP.

=== "Hapify (long)"

    ```hapify
    <<for Fields internal field>>
        <<if field boolean>>
    $default<<field pascal>> = false;
        <<elseif field string>>
    $default<<field pascal>> = '';
        <<elseif field number>>
    $default<<field pascal>> = 0;
        <<else>>
    $default<<field pascal>> = NULL;
        <<endif>>
    <<endfor>>
    ```

=== "Hapify (short)"

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

=== "EJS"

    ```js
    <% for (let field of model.fields.filter(f => f.internal)) { -%>
        <% if (field.type === 'boolean') { -%>
    $default<%= field.names.pascal %> = false;
        <% } else if (field.type === 'string') { -%>
    $default<%= field.names.pascal %> = '';
        <% } else if (field.type === 'number') { -%>
    $default<%= field.names.pascal %> = 0;
        <% } else { -%>
    $default<%= field.names.pascal %> = NULL;
        <% } -%>
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let field of model.fields.filter(f => f.internal)) {
        output += `$default${field.names.pascal} = ${getDefaultValue(field)};\n`
    }
    return output;
    
    function getDefaultValue(field) {
        switch (field.type) {
            case 'boolean':
                return 'false';
            case 'string':
                return "''";
            case 'number':
                return '0';
            default:
                return 'NULL';
        }
    }
    ```

=== "Output"

    ```php
    $defaultId = '';
    $defaultCreatedAt = NULL;
    $defaultStock = 0;
    ```

#### Import all dependencies

In a template of type `one model`, this block imports other data models linked by fields of type entity.
If the data model has a self-dependency, it will not be included in the loop.

=== "Hapify (long)"

    ```hapify
    <<for Dependencies dep>>
    import {<<dep pascal>>} from '../<<dep kebab>>';
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ D d>>
    import {<<d AA>>} from '../<<d a-a>>';
    <<@>>
    ```

=== "EJS"

    ```js
    <% for (let dep of model.dependencies.list) { -%>
    import {<%= dep.names.pascal %>} from '../<%= dep.names.kebab %>';
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let dep of model.dependencies.list) {
        output += `import {${dep.names.pascal}} from '../${dep.names.kebab}';\n`;
    }
    return output;
    ```

=== "Output"

    ```typescript
    import {Restaurant} from '../restaurant';
    import {User} from '../user';
    import {MenuPart} from '../menu-part';
    import {MenuItem} from '../menu-item';
    ```

You can also filter by referent field attributes.
This block excludes data models with hidden referent fields:

=== "Hapify (long)"

    ```hapify
    <<for Dependencies not hidden dep>>
    import {<<dep pascal>>} from '../<<dep kebab>>';
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ D !hd d>>
    import {<<d AA>>} from '../<<d a-a>>';
    <<@>>
    ```

=== "EJS"

    ```js
    <% for (let dep of model.dependencies.filter(f => !f.hidden)) { -%>
    import {<%= dep.names.pascal %>} from '../<%= dep.names.kebab %>';
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let dep of model.dependencies.filter(f => !f.hidden)) {
        output += `import {${dep.names.pascal}} from '../${dep.names.kebab}';\n`;
    }
    return output;
    ```

=== "Output"

    ```typescript
    import {PlaceCategory} from '../place-category';
    import {Service} from '../service';
    import {User} from '../user';
    ```

#### Cascading deletion

In a template of type `one model`, this block enumerates all data models that refer to the current data model and deletes them.
The first iteration loops over all the data models that have a dependency on it.
The second iteration loops over all the entity relations contained in these dependent data models.

!!! note "Note"
    The `ReferencedIn` array contains all data models that refer to the current data model through entity type fields.
    Only entity fields that are referencing are defined in these referencing data models.
    Therefore, if you loop over the fields in the referring data models, you will not be confused by other fields.

=== "Hapify (long)"

    ```hapify
    <<for ReferencedIn referrer>>
        <<for referrer.fields field>>
    await db.collection('<<referrer pascal>>').deleteMany({ <<field snake>>: id });
        <<endfor>>
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ R m>>
        <<@ m.f f>>
    await db.collection('<<m AA>>').deleteMany({ <<f a_a>>: id });
        <<@>>
    <<@>>
    ```

=== "EJS"

    ```js
    <% for (let referrer of model.referencedIn) { -%>
        <% for (let field of referrer.fields) { -%>
    await db.collection('<%= referrer.names.pascal %>').deleteMany({ <%= field.names.snake %>: id });
       <% } -%>
    <% } -%>
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    for (let referrer of model.referencedIn) {
        for (let field of referrer.fields) {
            output += `await db.collection('${referrer.names.pascal}').deleteMany({ ${field.names.snake}: id });\n`;
        }
    }
    return output;
    ```

=== "Output"

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

## Notes

It is possible to add notes to a field or a model.
Here is how to find them in the templates:

=== "Hapify (long)"

    ```hapify
    <<if Model hasNotes>>// <<! Model>><<endif>>
    export class <<Model pascal>> {
        <<for Fields field>>
        public <<field camel>>; <<if field hasNotes>>// <<! field>><<endif>>
        <<endfor>>
    }
    ```

=== "Hapify (short)"

    ```hapify
    <<? M hN>>// <<! M>><<?>>
    export class <<M AA>> {
        <<@ F f>>
        public <<f aA>>; <<? f hN>>// <<! f>><<?>>
        <<@>>
    }
    ```

=== "EJS"

    ```js
    <% if (model.hasNotes) { %>// <%= model.notes %><% } %>
    export class <%= model.names.pascal %> {
    <% for (const field of model.fields.list) { -%>
        public <%= field.names.camel %>; <% if (field.hasNotes) { %>// <%= field.notes %><% } %>
    <% } %>
    }
    ```

=== "JavaScript"

    ```javascript
    let output = '';
    if (model.hasNotes) { output += `// ${model.notes}\n`; }
    output += `export class ${model.names.pascal} {
    ${getFields()}}`;
    
    function getFields() {
        let fields = '';
        for (const field of model.fields.list) {
            fields += `    public ${field.names.camel};`;
            if (field.hasNotes) { fields += ` // ${field.notes}`; }
            fields += `\n`;
        }
        return fields;
    }
    return output;
    ```

=== "Output"

    ```typescript
    // A user can only list its own bookmarks
    export class Bookmark {
        public id;
        public owner; // Current user when creating the bookmark
        public place;
    }
    ```

!!! tip "Tip"
    With the Hapify syntax it is also possible to display notes using interpolation: `#!hapify <<= root.notes >>` or `#!hapify <<= model.notes >>` for a model or `#!hapify <<= field.notes >>` for a field.

## Exclusion of generated files

It is possible to exclude some files from the generation.
If the template returns an empty string or a string containing only spaces, then no file will be generated for this template/data model pair.

