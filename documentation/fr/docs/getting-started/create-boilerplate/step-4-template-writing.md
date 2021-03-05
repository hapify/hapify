## Introduction

Cette section aborde des cas d'utilisation typiques des templates. Chaque exemple de code est fournit avec les moteurs de templates suivants:

- Hapify (Syntaxes longue et courte)
- EJS
- JavaScript

Pour connaitre tous les détails de la syntaxe Hapify, veuillez vous référer [ici](../../reference/hapify/syntax.md).

Pour vous renseigner sur la syntax EJS, veuillez vous reférer à la [documentation officielle](https://ejs.co/#docs).

### Manipulation du modèle de données

Les templates reçoivent en entrée l'[objet modèle](../../model-object/). Cet objet, injecté dans les templates, explicite le modèle de données ainsi que toutes ses propriétés et relations, de sorte qu'elles soient facilement accessibles depuis le template.

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

=== "Sortie"

    ```typescript
    class Place {
        private primaryKey = '_id';
    }
    ```

### Conditions

#### Inclure les dépendances en fonction des attributs du champ

Dans un template de type `one model`, ce bloc importe le pilote MongoDb si le modèle de données a une relation avec un autre.

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

=== "Sortie"

    ```javascript
    const mongoDb = require('mongodb');
    ```

#### Inclure la validation de la session si l'opération nécessite une authentification

Dans un template de type `one model`, si l'opération `create` nécessite au moins un utilisateur authentifié, ce bloc récupère l'utilisateur connecté.

=== "Hapify (long)"

    ```hapify
    <<if CreateAccess gteAuth>>
    const user = Session.getCurrent();
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<? Ac [au>>
    const user = Session.getCurrent();
    <<?>>
    ```

=== "Sortie"

    ```javascript
    const user = Session.getCurrent();
    ```

#### Tester si le modèle de données est géo-localisé

Dans un template de type `one model`, si le modèle de données a la propriété `isGeolocated` (c'est-à-dire si le modèle de données contient au moins un champ de latitude et un champ de longitude),
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

=== "Sortie"

    ```html
    <app-map-position-picker [model]="place"></app-map-position-picker>
    ```

#### Obtenir des relations basées sur la cardinalité

Cet exemple crée une méthode récupérants des entités dans un magasin, selon le type de relation : one-to-one, one-to-many ou many-to-many

=== "Hapify (long)"

    ```hapify
    class <<Model pascal>> extends BaseModel {
    <<for Fields entity field>>
        get<<field pascal>>() {
        <<if field oneOne>>
            return this.<<field.model camel>>Store.findOne(this.properties.<<field camel>>);
        <<elseif field oneMany or manyMany>>
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
        <<? f tEoo>>
            return this.<<f.m aA>>Store.findOne(this.properties.<<f aA>>);
        <<?? f tEom + tEmm>>
            return this.<<f.m aA>>Store.findMany(this.properties.<<f aA>>);
        <<?>>
        }
    <<@>>
    }
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
    <<for Fields hidden f>>
        '<<f camel>>',
    <<endif>>
    ];
    ```

=== "Hapify (short)"

    ```hapify
    const hiddenFields = [
    <<@ F hd f>>
        '<<f aA>>',
    <<?>>
    ];
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

Dans un template de type `all models`, cela appellera les fichiers de tous les modèles.

=== "Hapify (long)"

    ```hapify
    <<for Models m>>
    require_once('./<<m kebab>>.php'),
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ M m>>
    require_once('./<<m a-a>>.php'),
    <<@>>
    ```

=== "Sortie"

    ```php
    require_once('./user.php'),
    require_once('./place.php'),
    require_once('./service.php'),
    require_once('./place-category.php'),
    ```

#### Créer un fichier d'index comprenant des modèles accessibles uniquement par les administrateurs

Si vous voulez restreindre la boucle précédente pour les modèles qui ne contiennent que des opérations de type admin :

=== "Hapify (long)"

    ```hapify
    <<for Models onlyAdmin m>>
    require_once('./<<m kebab>>.php'),
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ M pOAd m>>
    require_once('./<<m a-a>>.php'),
    <<@>>
    ```

=== "Sortie"

    ```php
    require_once('./menu.php'),
    require_once('./menu-part.php'),
    require_once('./menu-item.php'),
    require_once('./order.php'),
    ```

#### Définir une valeur par défaut en fonction du type de données pour les champs internes

Dans un template de type `one model`, ce bloc attribue une valeur au champ en fonction de son type pour tous les champs `internal`.
Si le type du champ est `boolean`, il attribue la valeur `false`, si le type est `string`, il attribue la valeur `''`, si le type est `number`, il attribue la valeur `0`, sinon il attribue la valeur `NULL`.
Ce template génère du PHP.

=== "Hapify (long)"

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
    <<for Dependencies d>>
    import {<<d pascal>>} from '../<<d kebab>>';
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ D d>>
    import {<<d AA>>} from '../<<d a-a>>';
    <<@>>
    ```

=== "Sortie"

    ```typescript
    import {Restaurant} from '../restaurant';
    import {User} from '../user';
    import {MenuPart} from '../menu-part';
    import {MenuItem} from '../menu-item';
    ```

Vous pouvez également filtrer les modèles par attributs des champs. Ce bloc exclut les modèles qui contiennent des champs cachés :

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
    Par conséquent, si vous bouclez les champs des modèles de données référents, vous ne serez pas brouillés par d'autres champs.

=== "Hapify (long)"

    ```hapify
    <<@ ReferencedIn model>>
        <<for model.fields field>>
    await db.collection('<<model pascal>>').deleteMany({ <<field snake>>: id });
        <<endfor>>
    <<@>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ R m>>
        <<@ m.f f>>
    await db.collection('<<m AA>>').deleteMany({ <<f a_a>>: id });
        <<@>>
    <<@>>
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
