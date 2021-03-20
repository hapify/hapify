## Introduction

Cette section aborde des cas d'utilisation typiques des templates. Chaque exemple de code est fourni avec les moteurs de templates suivants:

- Hapify (Syntaxes longue et courte)
- EJS
- JavaScript

Pour connaitre tous les détails de la syntaxe Hapify, veuillez vous référer [ici](../../reference/hapify-syntax.md).

Pour vous renseigner sur la syntaxe EJS, veuillez vous référer à la [documentation officielle](https://ejs.co/#docs).

!!! warning "Attention"
    Toutes les fonctionnalités d'EJS sont disponibles, sauf la fonctionnalité `include`.
    Cette fonction est volontairement désactivée afin que les templates n'aient pas accès à votre système de fichiers.

### Manipulation du modèle de données

Les templates reçoivent en entrée l'[objet modèle](../../reference/model-object.md). Cet objet, injecté dans les templates, explicite le modèle de données ainsi que toutes ses propriétés et relations, de sorte qu'elles soient facilement accessibles depuis le template.

Nous vous recommandons de connaître sa structure avant de vous lancer dans l'écriture de templates.

## Exemples de code

### Noms

#### Créer une classe pour le modèle de données courant

Ce bloc crée une classe pour le modèle de données (en casse `pascal`) et défini le nom de la clé primaire, en casse `snake`.

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

=== "Sortie"

    ```typescript
    class Place {
        private primaryKey = '_id';
    }
    ```

### Conditions

#### Inclure les dépendances en fonction des attributs du champ

Dans un template de type `one model`, ce bloc importe le pilote MongoDB si le modèle de données a une relation avec un autre.

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

=== "Sortie"

    ```javascript
    const mongoDb = require('mongodb');
    ```

#### Valider la session si l'opération nécessite une authentification

Dans un template de type `one model`, si l'action `create` requiert au plus un utilisateur authentifié, ce bloc récupère l'utilisateur connecté.

!!! info "Rappel"
    `guest` est l'accès le plus permissif et `admin` le moins permissif. Par conséquent `admin < owner < authenticated < guest`.

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

=== "Sortie"

    ```javascript
    const user = Session.getCurrent();
    ```

#### Tester si le modèle de données est géo-localisé

Dans un template de type `one model`, si le modèle de données a la propriété `isGeolocated` (c'est-à-dire si le modèle de données contient au moins un champ latitude et un champ longitude),
ce bloc importe le composant de sélection de la position sur la carte.

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

=== "Sortie"

    ```html
    <app-map-position-picker [model]="place"></app-map-position-picker>
    ```

#### Obtenir des relations basées sur la cardinalité

Cet exemple crée une méthode récupérant des entités dans un magasin, selon le type de relation : `one-to-one`, `one-to-many` ou `many-to-many`

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

=== "Sortie"

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


### Itérations

#### Remplir un tableau avec tous les noms de champs cachés

Dans un template de type `one model`, ce bloc crée un tableau (en JavaScript) qui contient les noms des champs `hidden` (en casse `camel`).

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

=== "Sortie"

    ```javascript
    const hiddenFields = [
        'password',
        'token',
    ];
    ```

#### Créer un tableau contenant toutes les valeurs possibles d'une énumération

Dans un template de type `one model`, ce bloc définit les valeurs d'énumération sous forme de tableaux (en casse `constant`) :

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

=== "Sortie"

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

#### Créer un fichier d'index comprenant tous les modèles de données

Dans un template de type `all models`, ceci appellera les fichiers de tous les modèles.

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

=== "Sortie"

    ```php
    require_once('./user.php');
    require_once('./place.php');
    require_once('./service.php');
    require_once('./place-category.php');
    ```

#### Créer un fichier d'index comprenant des modèles accessibles uniquement par les administrateurs

Si vous voulez restreindre la boucle précédente pour les modèles qui ne contiennent que des opérations de type admin :

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

=== "Sortie"

    ```php
    require_once('./menu.php');
    require_once('./menu-part.php');
    require_once('./menu-item.php');
    require_once('./order.php');
    ```

#### Définir une valeur par défaut en fonction du type de données

Dans un template de type `one model`, ce bloc attribue une valeur au champ en fonction de son type pour tous les champs `internal`.
Si le type du champ est `boolean`, il attribue la valeur `false`, si le type est `string`, il attribue la valeur `''`, si le type est `number`, il attribue la valeur `0`, sinon il attribue la valeur `NULL`.
Ce template génère du PHP.

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

=== "Sortie"

    ```php
    $defaultId = '';
    $defaultCreatedAt = NULL;
    $defaultStock = 0;
    ```

#### Importer toutes les dépendances

Dans un template de type `one model`, ce bloc importe d'autres modèles de données pointés par des champs de type entité.
Si le modèle a une auto-dépendance, il ne sera pas inclus dans la boucle.

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

=== "Sortie"

    ```typescript
    import {Restaurant} from '../restaurant';
    import {User} from '../user';
    import {MenuPart} from '../menu-part';
    import {MenuItem} from '../menu-item';
    ```

Vous pouvez également filtrer par attributs de champ référent.
Ce bloc exclut les modèles dont les champs référents sont cachés :

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

=== "Sortie"

    ```typescript
    import {PlaceCategory} from '../place-category';
    import {Service} from '../service';
    import {User} from '../user';
    ```

#### Suppression en cascade

Dans un template de type `one model`, ce bloc énumère tous les modèles de données qui se réfèrent au modèle de données courant et les supprime.
La première itération boucle sur tous les modèles de données qui ont une dépendance à celui-ci.
La deuxième itération boucle sur toutes les relations d'entités contenues dans ces modèles de données dépendants.

!!! note "Notes"
    Le tableau `ReferencedIn` contient tous les modèles de données qui se réfèrent au modèle de données courant à travers des champs de type entité.
    Seuls les champs de type entité faisant référence sont définis dans ces modèles de données référents.
    Par conséquent, si vous bouclez sur les champs des modèles de données référents, vous ne serez pas brouillés par d'autres champs.

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

=== "Sortie"

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

## Exclusion de fichiers générés

Lors de la génération il est possible d'exclure certain fichier de la génération.
Si le template retourne une chaine vide ou ne contenant que des espaces, alors aucun fichier ne sera généré pour ce couple template/modèle de données.

