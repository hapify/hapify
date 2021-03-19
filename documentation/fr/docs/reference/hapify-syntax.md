## Pourquoi utiliser une syntaxe spécifique ?

Nous avons conçu une syntaxe capable de manipuler [l'objet modèle](./model-object.md) injecté dans les templates.
Cette syntaxe est optimisée pour jouer avec les propriétés de cet objet modèle en utilisant des mots courts.
Cela permet de gérer des idées complexes avec des phrases courtes.

Par exemple, cette boucle en JavaScript :

```javascript
for (let field of root.fields.filter(f => f.searchable && f.type === 'entity')) {
	out += '    Do something';
}
```

sera écrit comme ceci avec la syntaxe Hapify :

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
    
### Syntaxes longue et courte

Les templates Hapify peuvent être écrits avec une syntaxe longue ou courte.

Les deux ont des avantages :

 - La syntaxe courte n'interfère pas avec le code cible lors de la lecture du template, grâce à un méta-code plus court.
 - La syntaxe longue est explicite et peut être lue naturellement.

Dans un même template, vous pouvez mélanger les deux syntaxes.

!!! note "Note"
    Tous les exemples de codes ci-dessous sont traduits en équivalent JavaScript à titre informatif.
    Lors de la génération, la syntaxe Hapify est convertie en code JavaScript semblable.
    
## Balises

Les blocs de syntaxe Hapify sont enveloppés par deux balises :

- ouverture : `<<`.
- fermeture : `>>`.

### Échappement

Généralement utilisées pour les opérations binaires, ces balises peuvent être échappées.
Les balises échappées `\<\<` (et `\>\>`) sont remplacées par `<<` (et `>>`) lors de la génération.

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
    
=== "Équivalent JavaScript"

    ```javascript
    out += `// Create a new ${root.names.lower}
    const ${root.names.camel} = new ${root.names.pascal}();`;
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
    
=== "Équivalent JavaScript"

    ```javascript
    out += `<?php
    $fields = array(
        ${root.fields.list.map(f => "'"+f.names.camel+"'").join(",\n\t")}
    );`;
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
    
=== "Équivalent JavaScript"

    ```javascript
    out += `const utils = require('utils');`;
    if (root.fields.filter(f => f.type === 'entity').length > 0) {
        out += `\nconst mongoDb = require('mongodb');`;
    }
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

#### Sans filtre

Le filtrage des champs est optionnel.

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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.fields.list.length > 0) {
        out += '    // this model has at least one field';
    }
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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.fields.filter(f => f.type === 'entity').length > 0) {
        out += '    // At least one entity field';
    } else if (root.fields.filter(f => f.hidden).length > 0) {
        out += '    // No entity field and at least one hidden field';
    } else {
        out += '    // No entity field and no hidden field';
    }
    ```

### Conditions complexes

#### Opérateurs

Les opérateurs disponibles pour écrire les conditions sont :

-   `and` - alias `*` ou `&&`
-   `or` - alias `+` ou `||`
-   `and not` - alias `andNot`, `/` ou `&& !`
-   `or not` - alias `orNot`, `-` ou `|| !`

**Exemple**

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
    
=== "Équivalent JavaScript"

    ```javascript
    for (let field of root.fields.filter(f => (f.type === 'entity' && f.hidden) || (f.unique && !f.multiple))) {
        out += '    // ...';
    }
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
    
=== "Équivalent JavaScript"

    ```javascript
    for (let field of root.fields.filter(f => (f.type === 'entity' && f.hidden) || (f.unique && !f.multiple))) {
        out += '    // ...';
    }
    ```

#### Conditions relatives au nombre d'occurrences

En précisant un nombre après le `if`, on peut ajouter une condition sur le nombre minimum d’éléments requis, ici les champs :

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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.fields.filter(f => f.hidden).length >= 4) {
        out += '    // This model has at least 4 hidden fields';
    } else if (root.fields.filter(f => f.label || f.type === 'boolean').length >= 2) {
        out += '    // This model has at least 2 label or boolean fields';
    } else {
        out += '    // Something else';
    }
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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.properties.isGeolocated) {
        out += '    // ...';
    }
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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.filter(m => !m.accesses.properties.onlyGuest).length > 0) {
        out += "    import 'session-service';";
    }
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

**Exemple**

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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.fields.filter(f => (f.restricted || f.internal) && !f.number).length > 0) {
        out += "    // ...";
    }
    ```

#### Filtrage sur les propriétés du modèle de données

Propriétés disponibles pour un modèle de données :

-   `mainlyHidden` (alias: `pMHd`) la majorité des champs sont `hidden` (strictement)
-   `mainlyInternal` (alias: `pMIn`) la majorité des champs sont `internal` (strictement)
-   `isGeolocated` (alias: `pGeo`) Le modèle de données contient au moins un champ `latitude` et un champ `longitude`.
-   `isGeoSearchable` (alias: `pGSe`) Le modèle de données contient au moins un champ `latitude` et un champ `longitude` recherchables.

**Exemple**

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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.properties.isGeolocated) {
        out += "    // ...";
    }
    ```

Propriétés d'accès disponibles pour un modèle de données :

-   `onlyAdmin` (alias: `pOAd`) Le modèle de données ne contient que des accès restreints à `admin`
-   `onlyOwner` (alias: `pOOw`) Le modèle de données ne contient que des accès restreints à `owner`
-   `onlyAuth` (alias: `pOAu`) Le modèle de données ne contient que des accès restreints à `authenticated`
-   `onlyGuest` (alias: `pOGs`) Le modèle de données ne contient que des accès restreints à `guest`
-   `maxAdmin` (alias: `pMAd`) L'accès le plus permissif est `admin`
-   `maxOwner` (alias: `pMOw`) L'accès le plus permissif est `owner`
-   `maxAuth` (alias: `pMAu`) L'accès le plus permissif est `authenticated`
-   `maxGuest` (alias: `pMGs`) L'accès le plus permissif est `guest`
-   `noAdmin` (alias: `pNAd`) Aucune action n'est restreinte à `admin`
-   `noOwner` (alias: `pNOw`) Aucune action n'est restreinte à `owner`
-   `noAuth` (alias: `pNAu`) Aucune action n'est restreinte à `authenticated`
-   `noGuest` (alias: `pNGs`) Aucune action n'est restreinte à `guest`

**Exemple**

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
    
=== "Équivalent JavaScript"

    ```javascript
    if (root.accesses.properties.onlyAdmin) {
        out += "    // ...";
    }
    ```

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

**Exemples**

Teste l'accès pour une action précise :

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

=== "Équivalent JavaScript"

    ```javascript
    if (root.accesses.read.guest) {
        out += '    // ...';
    }
    ```

Teste si l'action de mise à jour est restreinte soit aux administrateurs soit au propriétaire :

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

=== "Équivalent JavaScript"

    ```javascript
    if (root.accesses.update.admin || root.accesses.update.owner) {
        out += '    // ...';
    }
    ```
    
Teste si au moins une action est restreinte à un utilisateur authentifié ou moins :

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

=== "Équivalent JavaScript"

    ```javascript
    if (root.accesses.filter(a => a.lteAuth).length > 0) {
        out += '    // ...';
    }
    ```
    
!!! tip "À savoir"
    Les conditions peuvent être utilisées sur un objet ou un tableau d'objets.
    S'il est utilisé sur un tableau, il testera la longueur du tableau filtré par la condition fournie.
    Il peut être utilisé sur n'importe quel objet contenant une méthode `filter` qui reçoit un callback retournant un booléen.
    Par exemple, dans la structure du modèle de données, `root.dependencies` est un objet qui contient une méthode `filter`.
    Ainsi, cet opérateur peut tester si un modèle a des dépendances qui ont des champs avec une condition spécifique.

## Itérations

Les itérations utilisent les mêmes filtres et opérateurs que les conditions.

### Itération simple

Boucle sur tous les champs d'un modèle de données qui ne sont pas cachés et les assigne à la variable `field` :

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

=== "Équivalent JavaScript"

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

Exemple pour un modèle de données avec les champs `name`, `created at` et `role`, dont `role` est caché :

```php
<?php
$fields = array(
    'name',
    'createdAt',
);
```

Boucle sur les champs de type `entity` et recherchables du modèle de données :

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

=== "Équivalent JavaScript"

    ```javascript
    for (let field of root.fields.filter(f => f.searchable && f.type === 'entity')) {
        out += '    // ...';
    }
    ```
    
#### Boucler sans filtrer

Cette opération permet de passer en revue tous les champs :

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

=== "Équivalent JavaScript"

    ```javascript
    for (let field of root.fields.list) {
        out += '    // ...';
    }
    ```
    
#### Boucler sur les modèles de données

Dans un template de type `all models`, ceci boucle sur tous les modèles de données qui sont géo-localisés :

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

=== "Équivalent JavaScript"

    ```javascript
    for (let model of root.filter(i => i.properties.isGeolocated)) {
        out += '    // ...';
    }
    ```
    
#### Boucler sur les dépendances
    
Dans un template de type `one model`, ceci boucle sur les dépendances dont le champ référent est recherchable :

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

=== "Équivalent JavaScript"

    ```javascript
    for (let dep of root.dependencies.filter(f => f.searchable)) {
        out += '    // ...';
    }
    ```
    
!!! tip "À savoir"
    Dans le cas d'un modèle de données qui se réfère à lui-même, `Dependencies` exclue cette auto-dépendance.
    Pour l'inclure utilisez le code suivant:
    ```hapify
    <<< for (let dep of root.dependencies.filter(f => f, false)) { >>>
        // ...
    <<< } >>>
    ```
    
!!! warning "Attention"
    Le filtrage de `Dependencies` ne s'effectue que sur les champs du modèle de données courant qui portent la référence.
    Le filtrage ne s'effectue **pas** sur les champs du modèle de données cible.
    
#### Boucler sur les modèles de données référents
    
Dans un template de type `one model`, ceci boucle sur les modèles de données ayant une dépendance envers celui-ci et qui sont géo-localisés :

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

=== "Équivalent JavaScript"

    ```javascript
    for (let referrer of root.referencedIn.filter(m => m.properties.isGeolocated)) {
        out += '    // ...';
    }
    ```
    
!!! tip "À savoir"
    Le filtre est optionnel. Vous pouvez obtenir tous les modèles de données référents comme ceci :
    ```hapify
    <<for ReferencedIn referrer>>
        // ...
    <<endfor>>
    ```
    
!!! warning "Attention"
    Seuls les champs de type entité faisant référence sont définis dans ces modèles de données référents.
    
#### Boucler sur les accès du modèle de données

Boucle sur tous les accès restreints à un administrateur ou au propriétaire et affiche le nom de l'action :

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

=== "Équivalent JavaScript"

    ```javascript
    for (let access of root.accesses.filter(a => a.admin || a.owner)) {
        out += `    ${access.action}\n`;
    }
    ```

### Itération raccourcie

Boucle sur les 2 premiers champs d'un modèle de données :

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

=== "Équivalent JavaScript"

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

Pour un modèle de données avec les champs `name`, `email` et `role` :

```php
<?php
$fields = array(
    'name',
    'email',
);
```

### Itérations imbriquées

#### Boucle sur les enum

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

=== "Équivalent JavaScript"

    ```javascript
    for (let field of root.fields.filter(f => f.type === 'enum')) {
        out += `type ${field.names.pascal} = ${field.enum.map(e => "'"+e.names.snake+"'").join(' | ')};`;
    }
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

Cet opérateur vous permet d'écrire du JavaScript pur.

### Variable personnalisée

Définit une variable personnalisée et l'ajoute à la sortie :

```hapify
<<< const length = root.fields.length; >>>

// This model has <<=length>> fields
```

### Fonction personnalisée

Définit une fonction personnalisée et l'appelle :

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

=== "Sortie"

    ```
    id
    created:at
    place:category
    ```

### Condition ou itération personnalisée

Ce bloc permet d'écrire une condition non gérée par la syntaxe Hapify :

```hapify
<<< if (root.fields.hidden.length < 3 || root.properties.mainlyInternal) { >>>
// ...
<<< } >>>
```

!!! tip "À savoir"
    Dans un template Hapify de type `one model`, la variable `root` pointe vers le modèle de données.
    Dans un template Hapify de type `all models`, la variable `root` pointe vers le tableau de modèles de données.

!!! seealso "Voir aussi"
    Pour connaitre en détail la structure du modèle de données, reportez-vous à [l'objet modèle](./model-object.md).

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

## Formatage

Les lignes vides ou ne contenant que du méta-code de type condition ou itération sont automatiquement supprimées suite à la génération.
Pour forcer le générateur à garder une ligne vide, insérez un ou plusieurs espaces au début de celle-ci.

!!! warning "Attention"
    Hapify ne formate pas le code généré, car les règles de mise en forme sont spécifiques à chaque langage voire chaque framework.
    Nous vous recommandons vivement d'utiliser un formateur de code suite à la génération.

## Mots réservés

La liste suivante de mots ne peut pas être utilisée pour nommer des variables.

`A`, `Ac`, `Accesses`, `Ad`, `An`, `Ar`, `As`, `Au`, `CountAccess`, `CreateAccess`, `D`, `Dependencies`, `F`, `Fields`, `M`, `Model`, `Models`, `P`, `PrimaryField`, `R`, `ReadAccess`, `RefModels`, `ReferencedIn`, `RemoveAccess`, `SearchAccess`, `UpdateAccess`, `ad`, `admin`, `and`, `andNot`, `au`, `audio`, `auth`, `boolean`, `date`, `datetime`, `document`, `else`, `elseif`, `em`, `email`, `embedded`, `endfor`, `endif`, `entity`, `enum`, `file`, `float`, `for`, `gs`, `gteAdmin`, `gteAuth`, `gteGuest`, `gteOwner`, `guest`, `hd`, `hidden`, `if`, `image`, `in`, `integer`, `internal`, `isGeoSearchable`, `isGeolocated`, `label`, `latitude`, `lb`, `longitude`, `lteAdmin`, `lteAuth`, `lteGuest`, `lteOwner`, `mainlyHidden`, `mainlyInternal`, `manyMany`, `manyOne`, `maxAdmin`, `maxAuth`, `maxGuest`, `maxOwner`, `ml`, `multiple`, `noAdmin`, `noAuth`, `noGuest`, `noOwner`, `not`, `nu`, `nullable`, `number`, `object`, `oneMany`, `oneOne`, `onlyAdmin`, `onlyAuth`, `onlyGuest`, `onlyOwner`, `or`, `orNot`, `os`, `out`, `ow`, `owner`, `ownership`, `pGSe`, `pGeo`, `pMAd`, `pMAu`, `pMGs`, `pMHd`, `pMIn`, `pMOw`, `pNAd`, `pNAu`, `pNGs`, `pNOw`, `pOAd`, `pOAu`, `pOGs`, `pOOw`, `password`, `pr`, `primary`, `restricted`, `rich`, `richText`, `root`, `rs`, `se`, `searchable`, `so`, `sortable`, `string`, `tB`, `tD`, `tDd`, `tDt`, `tE`, `tEmm`, `tEom`, `tEoo`, `tF`, `tFa`, `tFd`, `tFi`, `tFv`, `tN`, `tNf`, `tNg`, `tNi`, `tNt`, `tO`, `tS`, `tSe`, `tSp`, `tSr`, `tSt`, `tSu`, `tU`, `text`, `time`, `un`, `unique`, `url`, `video`.
