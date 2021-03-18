## Pourquoi utiliser une syntaxe spécifique ?

Nous avons conçu une syntaxe capable de manipuler [l'objet modèle](../../model-object/) injecté dans les templates.
Cette syntaxe est optimisée pour jouer avec les propriétés de cet objet modèle en utilisant des mots courts.
Cela permet de gérer des idées complexes avec des phrases courtes.

Par exemple, cette boucle en Javascript :

```javascript
for (let f of model.fields.list.filter(f => f.searchable && f.type === 'entity')) {
	out += '    Do something';
}
```

sera écrit comme ceci avec la syntaxe Hapify :

=== "Hapify (long)"

    ```hapify
    <<for Fields searchable and entity f>>
        Do something
    <<endfor>>
    ```

=== "Hapify (short)"

    ```hapify
    <<@ F se*tE f>>
        Do something
    <<@>>
    ```

## Noms

### Noms du modèle de données

Dans un template de type `one model` :

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

Pour un modèle de données nommé `user group`, le résultat sera le suivant :

```javascript
// Create a new user group
const userGroup = new UserGroup();
```

### Noms des champs

Lister tous les champs d'un modèle de données :

=== "Hapify (long)"

    ```hapify
    <?php
    $fields = array(
    <<for Fields f>>
        '<<f camel>>',
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

Pour un modèle de données avec les champs `name`, `created at` et `role` :

```php
<?php
$fields = array(
    'name',
    'createdAt',
    'role',
);
```

### Casses

Les casses disponibles sont :

-   `camel` (alias : `aA`) pour `camelCase`
-   `pascal` (alias : `AA`) pour `PascalCase`
-   `lower` (alias : `a`) pour `lower case`
-   `capital` (alias : `A`) pour `Capital Case`
-   `kebab` (alias : `a-a`) pour `kebab-case`
-   `header` (alias : `A-A`) pour `Header-Case`
-   `snake` (alias : `a_a`) pour `snake_case`
-   `constant` (alias : `A_A`) pour `CONSTANT_CASE`
-   `compact` (alias : `aa`) pour `compactcase`
-   `raw` (alias : `R`) (raw) pour le nom original

## Conditions

### Condition simple

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

Pour un modèle de données qui contient au moins un champ de type `entity`, le résultat sera le suivant :

```javascript
const utils = require('utils');
const mongoDb = require('mongodb');
```

Pour un modèle qui ne contient pas de champ de type `entity`, le résultat sera le suivant :

```javascript
const utils = require('utils');
```

### Conditions alternatives

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

### Conditions complexes

#### Opérateurs

Les opérateurs disponibles pour écrire les conditions sont :

-   `and` - alias `*` ou `&&`
-   `or` - alias `+` ou `||`
-   `and not` - alias `andNot`, `/` ou `&& !`
-   `or not` - alias `orNot`, `-` ou `|| !`

Exemple:

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

Les conditions peuvent également être écrites avec des opérateurs natifs.
Réécrivons la dernière condition :

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

#### Conditions relatives au nombre d'occurrences

=== "Hapify (long)"

    ```hapify
    <<if3 Fields number>>
      // This block is reach if the model has at least 3 number field
    <<endif>>
    ```

=== "Hapify (short)"

    ```hapify
    <<?3 F tN>>
      // This block is reach if the model has at least 3 number field
    <<?>>
    ```

### Conditions sur les modèles de données

#### Tester un seul modèle de données

Dans un template de type `one model` :

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

#### Tester une liste de modèles de données

Dans un template de type `all models` :

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

### Objets et filtres disponibles

#### Objet racine

`Model` ou `Models` (abrégé : `M`) font référence à l'objet principal :

-   le modèle de données dans un template de type `one model`
-   le tableau de modèles de données dans un template de type `all models`

#### Objets filtrables et testables

Dans le cas d'un template de type `one model` :

-   `Fields` (alias: `F`) est la liste des champs
-   `Dependencies` (alias: `D`) est la liste des dépendances (liste de modèles de données)
-   `ReferencedIn` (alias: `RefModels`, `R`) est la liste des modèles de données qui dépendent de celui-ci
-   `PrimaryField` (alias: `P`) est le champ primaire du modèle
-   `Accesses` (alias: `A`) est la liste des accès
-   `CreateAccess` (alias: `Ac`) est l'accès à l'action de création
-   `ReadAccess` (alias: `Ar`) est l'accès à l'action de lecture
-   `UpdateAccess` (alias: `Au`) est l'accès à l'action de mise à jour
-   `RemoveAccess` (alias: `Ad`) est l'accès à l'action de suppression
-   `SearchAccess` (alias: `As`) est l'accès à l'action de recherche
-   `CountAccess` (alias: `An`) est l'accès à l'action de comptage

#### Filtrage sur les attributs de champ

Attributs disponibles pour un champ :

-   `primary` (alias: `pr`) pour le booléen `primary`
-   `unique` (alias: `un`) pour le booléen `unique`
-   `label` (alias: `lb`) pour le booléen `label`
-   `nullable` (alias: `nu`) pour le booléen `nullable`
-   `multiple` (alias: `ml`) pour le booléen `multiple`
-   `embedded` (alias: `em`) pour le booléen `embedded`
-   `searchable` (alias: `se`) pour le booléen `searchable`
-   `sortable` (alias: `so`) pour le booléen `sortable`
-   `hidden` (alias: `hd`) pour le booléen `hidden`
-   `internal` (alias: `in`) pour le booléen `internal`
-   `restricted` (alias: `rs`) pour le booléen `restricted`
-   `ownership` (alias: `os`) pour le booléen `ownership`
-   `string` (alias: `tS`) pour le type `string`
    -   `email` (alias: `tSe`) pour le type `string` et le sous-type `email`
    -   `password` (alias: `tSp`) pour le type `string` et le sous-type `password`
    -   `url` (alias: `tSu`) pour le type `string` et le sous-type `url`
    -   `text` (alias: `tSt`) pour le type `string` et le sous-type `text`
    -   `richText` (alias: `rich`, `tSr`) pour le type `string` et le sous-type `rich`
-   `number` (alias: `tN`) pour le type `number`
    -   `integer` (alias: `tNi`) pour le type `number` et le sous-type `integer`
    -   `float` (alias: `tNf`) pour le type `number` et le sous-type `float`
    -   `latitude` (alias: `tNt`) pour le type `number` et le sous-type `latitude`
    -   `longitude` (alias: `tNg`) pour le type `number` et le sous-type `longitude`
-   `boolean` (alias: `tB`) pour le type `boolean`
-   `datetime` (alias: `tD`) pour le type `datetime`
    -   `date` (alias: `tDd`) pour le type `datetime` et le sous-type `date`
    -   `time` (alias: `tDt`) pour le type `datetime` et le sous-type `time`
-   `enum` (alias: `tU`) pour le type `enum`
-   `entity` (alias: `tE`) pour le type `entity`
    -   `oneOne` (alias: `tEoo`) pour le type `entity` et le sous-type `oneOne`
    -   `oneMany` (alias: `tEom`) pour le type `entity` et le sous-type `oneMany`
    -   `manyOne` (alias: `tEmo`) pour le type `entity` et le sous-type `manyOne`
    -   `manyMany` (alias: `tEmm`) pour le type `entity` et le sous-type `manyMany`
-   `object` (alias: `tO`) pour le type `object`
-   `file` (alias: `tF`) pour le type `file`
    -   `image` (alias: `tFi`) pour le type `file` et le sous-type `image`
    -   `video` (alias: `tFv`) pour le type `file` et le sous-type `video`
    -   `audio` (alias: `tFa`) pour le type `file` et le sous-type `audio`
    -   `document` (alias: `tFd`) pour le type `file` et le sous-type `document`

#### Filtrage sur les propriétés du modèle de données

Propriétés disponibles pour un modèle de données :

-   `mainlyHidden` (alias: `pMHd`) la majorité des champs sont `hidden` (strictement)
-   `mainlyInternal` (alias: `pMIn`) la majorité des champs sont `internal` (strictement)
-   `isGeolocated` (alias: `pGeo`) Le modèle de données contient au moins un champ `latitude` et un champ `longitude`.
-   `isGeoSearchable` (alias: `pGSe`) Le modèle de données contient au moins un champ `latitude` et un champ `longitude` recherchables.

Propriétés d'accès disponibles pour un modèle de données :

-   `onlyAdmin` (alias: `pOAd`) Le modèle de données ne contient que des accès restreintes à `admin`
-   `onlyOwner` (alias: `pOOw`) Le modèle de données ne contient que des accès restreintes à `owner`
-   `onlyAuth` (alias: `pOAu`) Le modèle de données ne contient que des accès restreintes à `authentifié`
-   `onlyGuest` (alias: `pOGs`) Le modèle de données ne contient que des accès restreintes à `guest`
-   `maxAdmin` (alias: `pMAd`) L'accès le plus permissif est `admin`
-   `maxOwner` (alias: `pMOw`) L'accès le plus permissif est `owner`
-   `maxAuth` (alias: `pMAu`) L'accès le plus permissif est `authentifié`
-   `maxGuest` (alias: `pMGs`) L'accès le plus permissif est `guest`
-   `noAdmin` (alias: `pNAd`) Aucune action n'est restreinte à `admin`
-   `noOwner` (alias: `pNOw`) Aucune action n'est restreinte à `owner`
-   `noAuth` (alias: `pNAu`) Aucune action n'est restreinte à `authentifié`
-   `noGuest` (alias: `pNGs`) Aucune action n'est restreinte à `guest`

#### Filtrage sur les accès aux modèles de données

!!! info "Rappel"
    `guest` est l'accès le plus permissif et `admin` le moins permissif. Par conséquent `admin < owner < authenticated < guest`.

Filtres disponibles pour l'accès à une action :

-   `admin` (alias: `ad`) l'accès est `admin`
-   `owner` (alias: `ow`) l'accès est `owner`
-   `auth` (alias: `au`) l'accès est `auth`
-   `guest` (alias: `gs`) l'accès est `guest`
-   `gteAdmin` (alias: `[ad`) l'accès est supérieur ou égal à `admin`
-   `gteOwner` (alias: `[ow`) l'accès est supérieur ou égal à `owner`
-   `gteAuth` (alias: `[au`) l'accès est supérieur ou égal à `auth`
-   `gteGuest` (alias: `[gs`) l'accès est supérieur ou égal à `guest`
-   `lteAdmin` (alias: `ad]`) l'accès est inférieur ou égal à `admin`
-   `lteOwner` (alias: `ow]`) l'accès est inférieur ou égal à `owner`
-   `lteAuth` (alias: `au]`) l'accès est inférieur ou égal à `auth`
-   `lteGuest` (alias: `gs]`) l'accès est inférieur ou égal à `guest`

## Itérations

Les itérations utilisent les mêmes opérateurs que les conditions.

### Itération simple

Boucle sur tous les champs d'un modèle de données qui ne sont pas cachés et les assigne à la variable `f` :

=== "Hapify (long)"

    ```hapify
    <?php
    $fields = array(
    <<for Fields not hidden f>>
        '<<f camel>>',
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

Pour un modèle de données avec les champs `name`, `created at` et `role`, mais `role` est caché :

```php
<?php
$fields = array(
    'name',
    'createdAt',
);
```

### Itération raccourcie

Boucle sur les 2 premiers champs d'un modèle de données :

=== "Hapify (long)"

    ```hapify
    <?php
    $fields = array(
    <<for2 Fields f>>
        '<<f camel>>',
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

Pour un modèle de données avec les champs `name`, `email` et `role` :

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

### Itérations imbriquées

#### Boucle sur les enums

Dans un template de type `one model`, ce bloc définit un type TypeScript contenant les énumérations d'un champ :

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

=== "Sortie"

    ```javascript
    type Role = | 'admin' | 'user' | 'customer';
    ```

#### Boucler sur les champs de tous les modèles de données

Dans un template de type `all models`, ce bloc permet de passer en revue tous les champs de tous les modèles de données :

=== "Hapify (long)"

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

=== "Sortie"

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

## Entrées brutes et interpolation

Cet opérateur vous permet d'écrire du Javascript pur.

### Variable personnalisée

Définit une variable personnalisée et l'ajoute à la sortie :

```hapify
<<< const length = model.fields.length; >>>

// This model has <<=length>> fields
```

### Fonction personnalisée

Définit une fonction personnalisée et l'appelle :

=== "Hapify (long)"

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

=== "Sortie"

    ```
    id
    created:at
    place:category
    ```

### Condition ou itération personnalisée

Ce bloc permet d'écrire une condition non gérée par la syntaxe Hapify :

```hapify
<<< if (root.fields.hidden < 3 || root.properties.mainlyInternal) { >>>
// ...
<<< } >>>
```

!!! tip "Astuce"
    Dans un template Hapify de type `one model`, la variable `root` pointe vers le modèle de données.
    Dans un template Hapify de type `all models`, la variable `root` pointe vers le tableau de modèles de données.

!!! seealso "Voir aussi"
    Pour connaitre en détail la structure du modèle de données, reportez vous à [l'objet modèle](../../model-object/).

## Erreur

N'écrivez pas ceci : `#!hapify <<= JSON.stringify(root) >>`.
L'objet `root` a des propriétés récursives. Par conséquent, cette commande conduira à une boucle infinie.

## Commentaires

Cette syntaxe écrit un commentaire dans le template sans aucune sortie dans le fichier généré.

```hapify
<<# This is just a comment>>
```

## Échappement

Il est possible d'échapper les balises de la syntaxe Hapify avec le caractère `\` :

=== "Hapify"

    ```hapify
    $val = 4;
    $res = $val \<\< 3;
    $res = 4 \>\> $val;
    ```

=== "Sortie"

    ```php
    $val = 4;
    $res = $val << 3;
    $res = 4 >> $val;
    ```

## Mots réservés

La liste suivante de mots ne peut pas être utilisée pour nommer des variables.

`A`, `Ac`, `Accesses`, `Ad`, `An`, `Ar`, `As`, `Au`, `CountAccess`, `CreateAccess`, `D`, `Dependencies`, `F`, `Fields`, `M`, `Model`, `Models`, `P`, `PrimaryField`, `R`, `ReadAccess`, `RefModels`, `ReferencedIn`, `RemoveAccess`, `SearchAccess`, `UpdateAccess`, `ad`, `admin`, `and`, `andNot`, `au`, `audio`, `auth`, `boolean`, `date`, `datetime`, `document`, `else`, `elseif`, `em`, `email`, `embedded`, `endfor`, `endif`, `entity`, `enum`, `file`, `float`, `for`, `gs`, `gteAdmin`, `gteAuth`, `gteGuest`, `gteOwner`, `guest`, `hd`, `hidden`, `if`, `image`, `in`, `integer`, `internal`, `isGeoSearchable`, `isGeolocated`, `label`, `latitude`, `lb`, `longitude`, `lteAdmin`, `lteAuth`, `lteGuest`, `lteOwner`, `mainlyHidden`, `mainlyInternal`, `manyMany`, `manyOne`, `maxAdmin`, `maxAuth`, `maxGuest`, `maxOwner`, `ml`, `multiple`, `noAdmin`, `noAuth`, `noGuest`, `noOwner`, `not`, `nu`, `nullable`, `number`, `object`, `oneMany`, `oneOne`, `onlyAdmin`, `onlyAuth`, `onlyGuest`, `onlyOwner`, `or`, `orNot`, `os`, `out`, `ow`, `owner`, `ownership`, `pGSe`, `pGeo`, `pMAd`, `pMAu`, `pMGs`, `pMHd`, `pMIn`, `pMOw`, `pNAd`, `pNAu`, `pNGs`, `pNOw`, `pOAd`, `pOAu`, `pOGs`, `pOOw`, `password`, `pr`, `primary`, `restricted`, `rich`, `richText`, `root`, `rs`, `se`, `searchable`, `so`, `sortable`, `string`, `tB`, `tD`, `tDd`, `tDt`, `tE`, `tEmm`, `tEom`, `tEoo`, `tF`, `tFa`, `tFd`, `tFi`, `tFv`, `tN`, `tNf`, `tNg`, `tNi`, `tNt`, `tO`, `tS`, `tSe`, `tSp`, `tSr`, `tSt`, `tSu`, `tU`, `text`, `time`, `un`, `unique`, `url`, `video`.

!!! seealso "Voir aussi"
    Si vous souhaitez en savoir plus sur la syntaxe Hapify et sur la manière dont elle utilise [l'objet modèle](../../model-object/) injecté dans les templates, veuillez consulter cette [documentation](../../model-object/).
