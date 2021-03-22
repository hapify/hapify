Ce document décrit la structure de l'objet qui représente un modèle de données lors de l'écriture d'un template.

Avant de lire ce document, vous devriez jeter un coup d'œil à la section [concepts](../getting-started/concepts/models.md).

### Dans les templates

### Injection du modèle de données

L'entrée du template peut être définie comme `one model` ou `all models`.
Au cours de la génération, s'il est défini comme `one model`, le template sera appelé une fois pour chaque modèle de données. Par conséquent, il engendrera un fichier pour chaque modèle de données.
S'il est défini comme `all models`, le template sera appelé une seule fois pour tous les modèles de données. Il engendrera alors un unique fichier.

#### Modèle unique

Si le template ne nécessite qu'un seul modèle, alors un objet `model` (alias `m`) sera disponible comme variable globale dans le template.
Dans un template Hapify, il sera disponible sous `Model`, `M` ou encore `root`.
Dans un template EJS ou JavaScript, il sera disponible sous `model` ou `m`.

#### Plusieurs modèles

Si le template nécessite tous les modèles, un tableau `models` (alias `m`) sera disponible comme variable globale dans le template.
Ce tableau contient tous les modèles disponibles.
Dans un template Hapify, il sera disponible sous `Models`, `M` ou encore `root`.
Dans un template EJS ou JavaScript, il sera disponible sous `models` ou `m`.

### Structure de l'objet modèle

Les objets suivants seront disponibles dans le template.

#### Objet modèle

-   `id` (string): un ID unique
-   `name` (string): le nom du modèle, tel que l'utilisateur l'a saisi.
-   `names` (object): variantes calculées à partir de la propriété `name`.
    -   `raw` (string): tel que l'utilisateur l'a saisi. Exemple `Online item`.
    -   `kebab` (string): exemple `online-item`.
    -   `big` (string): exemple `ONLINE-ITEM`.
    -   `header` (string): exemple `Online-Item`.
    -   `snake` (string): exemple `online_item`.
    -   `constant` (string): exemple `ONLINE_ITEM`.
    -   `compact` (string): exemple `onlineitem`.
    -   `camel` (string): exemple `onlineItem`.
    -   `pascal` (string): exemple `OnlineItem`.
    -   `lower` (string): exemple `online item`.
    -   `capital` (string): exemple `Online Item`.
-   `fields` - alias `f` (object): un objet contenant tous les champs, regroupés dans différents tableaux. Voir la section *Objet de champ* pour en savoir plus sur la structure d'un champ.
    -   `list` - alias `l` (array): contenant tous les champs du modèle.
    -   `primary` - alias `pr` (Field): champ primaire du modèle. `null` si aucun champ primaire n'est défini.
    -   `unique` - alias `un` (array): les champs marqués comme `unique`.
    -   `label` - alias `lb` (array): les champs marqués comme `label`.
    -   `nullable` - alias `nu` (array): les champs marqués comme `nullable`.
    -   `multiple` - alias `ml` (array): les champs marqués comme `multiple`.
    -   `embedded` - alias `em` (array): les champs marqués comme `embedded`.
    -   `searchable` - alias `se` (array): les champs marqués comme `searchable`.
    -   `sortable` - alias `so` (array): les champs marqués comme `sortable`.
    -   `hidden` - alias `hd` (array): les champs marqués comme `hidden`.
    -   `internal` - alias `in` (array): les champs marqués comme `internal`.
    -   `restricted` - alias `rs` (array): les champs marqués comme `restricted`.
    -   `ownership` - alias `os` (array): les champs marqués comme `ownership`.
    -   `searchableLabel` - alias `sl` (array): les champs marqués comme `label` et `searchable`. Utile pour une recherche rapide par label.
    -   `filter` - alias `f` (function): filtrer les champs avec une règle personnalisée. Équivalent de `model.fields.list.filter`.
    -   `references` - alias `r` - modèle non profond uniquement (array): champs de type `entity`.
        -   `filter` - alias `f` (function): filtre le tableau.
-   `dependencies` - alias `d` - modèle non profond uniquement (object): les dépendances de ce modèle (vers d'autres modèles). Un modèle a une dépendance si l'un de ces champs est de type `entity`.
    -   `list` - alias `l` (array): modèles de données dépendants, sauf auto-dépendance. Ces modèles sont ajoutés en tant que "modèles profonds".
    -   `self` - alias `s` (boolean): ce modèle de données a une auto-dépendance.
    -   `filter` - alias `f` (function): filtre les dépendances.
        -   Premier argument (function - défaut `(f) => f`): fonction de filtrage recevant le champ du référent (le champ de type `entity`).
        -   Second argument (boolean - défaut `true`): booléen indiquant si il faut exclure l'auto-dépendance.
-   `referencedIn` - alias `ri` - modèle non profond uniquement (array): modèles qui font référence à celui-ci. Ces modèles sont ajoutés en tant que "modèles profonds". Ces modèles ne contiennent que des champs de type `entity` faisant référence au modèle courant.
    -   `filter` - alias `f` (function): filtre le tableau.
-   `properties` - alias `p` (object): les propriétés pré-calculées à partir des champs.
    -   `fieldsCount` (number): le nombre de champs contenus dans le modèle.
    -   `hasPrimary` (boolean): a un champ primaire.
    -   `hasUnique` (boolean): a au moins un champ unique.
    -   `hasLabel` (boolean): a au moins un champ label.
    -   `hasNullable` (boolean): a au moins un champ nullable.
    -   `hasMultiple` (boolean): a au moins un champ multiple.
    -   `hasEmbedded` (boolean): a au moins un champ embarqué.
    -   `hasSearchable` (boolean): a au moins un champ recherchable.
    -   `hasSortable` (boolean): a au moins un champ triable.
    -   `hasHidden` (boolean): a au moins un champ caché.
    -   `hasInternal` (boolean): a au moins un champ interne.
    -   `hasRestricted` (boolean): a au moins un champ restreint.
    -   `hasOwnership` (boolean): a au moins un champ de propriété.
    -   `hasSearchableLabel` (boolean): le modèle a au moins un champ marqué comme label et également recherchable.
    -   `hasDependencies` - modèle non profond uniquement (boolean): le modèle a des dépendances avec d'autres modèles ou avec lui-même (par le biais d'un champ `entity`).
    -   `isReferenced` - modèle non profond uniquement (boolean): est référencé par d'autres modèles.
    -   `mainlyHidden` (boolean): la majorité des champs sont cachés (strictement).
    -   `mainlyInternal` (boolean): la majorité des champs sont internes (strictement).
    -   `isGeolocated` (boolean): contient au moins un champ latitude et un champ longitude.
    -   `isGeoSearchable` (boolean): contient au moins un champ latitude recherchable et un champ longitude recherchable.
-   `accesses` - alias `a` (object): les accès au modèle regroupés par action ou restriction. Voir la section *Objet d'accès* pour en savoir plus sur la structure des accès.
    -   `list` - alias `l` (array): tous les accès au modèle.
    -   `admin` - alias `ad` (array): les accès limités à `admin`.
    -   `owner` - alias `ow` (array): les accès limités à `owner`.
    -   `auth` - alias `au` (array): les accès limités à `authenticated`.
    -   `guest` - alias `gs` (array): les accès limités à `guest`.
    -   `create` - alias `c` (object): l'accès à l'action `create`.
    -   `read` - alias `r` (object): l'accès à l'action `read`.
    -   `update` - alias `u` (object): l'accès à l'action `update`.
    -   `remove` - alias `d` (object): l'accès à l'action `delete`.
    -   `search` - alias `s` (object): l'accès à l'action `search`.
    -   `count` - alias `n` (object): l'accès à l'action `count`.
    -   `filter` - alias `f` (Function): filtrer les accès avec une règle personnalisée. Équivalent de `model.accesses.list.filter`.
    -   `properties` - alias `p` (object): propriétés pré-calculées à partir des accès.
        -   `onlyAdmin` (boolean): ne contient que des accès limités à `admin`.
        -   `onlyOwner` (boolean): ne contient que des accès limités à `owner`.
        -   `onlyAuth` (boolean): ne contient que des accès limités à `authenticated`.
        -   `onlyGuest` (boolean): ne contient que des accès limités à `guest`.
        -   `maxAdmin` (boolean): l'accès le plus permissif est `admin`.
        -   `maxOwner` (boolean): l'accès le plus permissif est `owner`.
        -   `maxAuth` (boolean): l'accès le plus permissif est `authenticated`.
        -   `maxGuest` (boolean): l'accès le plus permissif est `guest`.
        -   `noAdmin` (boolean): il n'y a pas d'accès limité à `admin`.
        -   `noOwner` (boolean): il n'y a pas d'accès limité à `owner`.
        -   `noAuth` (boolean): il n'y a pas d'accès limité à `authenticated`.
        -   `noGuest` (boolean): il n'y a pas d'accès limité à `guest`.
        -   `hasAdmin` (boolean): il existe au moins un accès restreint à `admin`.
        -   `hasOwner` (boolean): il existe au moins un accès restreint à `owner`.
        -   `hasAuth` (boolean): il existe au moins un accès restreint à `authenticated`.
        -   `hasGuest` (boolean): il existe au moins un accès restreint à `guest`.

#### Objet de champ

-   `name` (string): le nom du champ, tel que l'utilisateur l'a saisi.
-   `names` (object): variantes calculées à partir de la propriété `name`.
    -   `raw` (string): tel que l'utilisateur l'a saisi. Exemple `first_name`.
    -   `kebab` (string): exemple `first-name`.
    -   `big` (string): exemple `FIRST-NAME`.
    -   `header` (string): exemple `First-Name`.
    -   `snake` (string): exemple `first_name`.
    -   `constant` (string): exemple `FIRST_NAME`.
    -   `compact` (string): exemple `firstname`.
    -   `camel` (string): exemple `firstName`.
    -   `pascal` (string): exemple `FirstName`.
    -   `lower` (string): exemple `first name`.
    -   `upper` (string): exemple `FIRST NAME`.
    -   `capital` (string): exemple `First Name`.
-   `primary` (boolean): est marqué comme `primary`.
-   `unique` (boolean): est marqué comme `unique`.
-   `label` (boolean): est marqué comme `label`.
-   `nullable` (boolean): est marqué comme `nullable`.
-   `multiple` (boolean): est marqué comme `multiple`.
-   `embedded` (boolean): est marqué comme `embedded`.
-   `searchable` (boolean): est marqué comme `searchable`.
-   `sortable` (boolean): est marqué comme `sortable`.
-   `hidden` (boolean): est marqué comme `hidden`.
-   `internal` (boolean): est marqué comme `internal`.
-   `restricted` (boolean): est marqué comme `restricted`.
-   `ownership` (boolean): est marqué comme `ownership`.
-   `type` (string): type du champ. Peut-être `string`, `number`, `boolean`, `datetime`, `entity`, `object` ou `file`.
-   `subtype` (string): sous-type du champ. Les valeurs disponibles dépendent du `type` :
    -   `string`: Peut-être `null`, `email`, `password`, `url`, `text` ou `rich`.
    -   `number`: Peut-être `null`, `integer`, `float`, `latitude` ou `longitude`.
    -   `boolean`: Est `null`.
    -   `datetime`: Peut-être `null`, `date` ou `time`.
    -   `entity`: Est `null`.
    -   `object`: Est `null`.
    -   `file`: Peut-être `null`, `image`, `video`, `audio` ou `document`.
-   `model` - alias `m` (object): objet modèle cible si le champ est de type `entity`. `null` sinon.
-   `enum` - alias `e` (array): un tableau contenant tous les enum si le champ est de type `enum`. `null` sinon. Voir la section *Objet enum* pour en savoir plus sur la structure d'un enum.
-   `value` (string|string[]):
    -   Si le type est `entity` : ID brut du modèle cible (string).
    -   Si le type est `enum` : liste brute d'enum (string[]).
    -   Sinon `null`.
    
#### Objet enum

-   `name` (string): nom de l'enum, tel que l'utilisateur l'a saisi.
-   `names` (object): variantes calculées à partir de la propriété `name`.
    -   `raw` (string): tel que l'utilisateur l'a saisi. Exemple `first_name`.
    -   `kebab` (string): exemple `first-name`.
    -   `big` (string): exemple `FIRST-NAME`.
    -   `header` (string): exemple `First-Name`.
    -   `snake` (string): exemple `first_name`.
    -   `constant` (string): exemple `FIRST_NAME`.
    -   `compact` (string): exemple `firstname`.
    -   `camel` (string): exemple `firstName`.
    -   `pascal` (string): exemple `FirstName`.
    -   `lower` (string): exemple `first name`.
    -   `upper` (string): exemple `FIRST NAME`.
    -   `capital` (string): exemple `First Name`.

#### Objet d'accès

-   `action` (string): nom de l'action. Peut-être `create`, `read`, `update`, `remove`, `search` ou `count`.
-   `admin` (boolean): l'accès est `admin`.
-   `owner` (boolean): l'accès est `owner`.
-   `auth` (boolean): l'accès est `authenticated`.
-   `guest` (boolean): l'accès est `guest`.
-   `gteAdmin` (boolean): l'accès est supérieur ou égal à `admin` (toujours `true`).
-   `gteOwner` (boolean): l'accès est supérieur ou égal à `owner`.
-   `gteAuth` (boolean): l'accès est supérieur ou égal à `authenticated`.
-   `gteGuest` (boolean): l'accès est supérieur ou égal à `guest`.
-   `lteAdmin` (boolean): l'accès est inférieur ou égal à `admin`.
-   `lteOwner` (boolean): l'accès est inférieur ou égal à `owner`.
-   `lteAuth` (boolean): l'accès est inférieur ou égal à `authenticated`.
-   `lteGuest` (boolean): l'accès est inférieur ou égal à `guest` (toujours `true`).
