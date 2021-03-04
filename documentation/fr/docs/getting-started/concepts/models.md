## Approche de modélisation

Hapify vous permet de définir les modèles de données qui correspondent aux spécifications de votre projet.

La définition du modèle dans Hapify est **agnostique** et **comportementales**. Ce qui signifie que Hapify définit ce que le modèle **doit faire**, et non pas **comment il le fera**.

## Gestion des accès

Afin de supprimer le besoin d’écrire des boilerplates répétitif pour des opérations CRUD étendues, Hapify prend en charge les 6 actions de base operations :

-   _Create_
-   _Read_
-   _Update_
-   _Delete_
-   _Search_
-   _Count_

Pour chacune de ces operations, Hapify vous permet de définir les restrictions d'accès suivantes :

- _Guest_ : utilisateur qui n'est pas connecté.
- _Authenticated_ : utilisateur connecté.
- _Owner_ : utilisateur connecté qui est propriétaire de l'entité (voir [Attributs de champ](#field-attributes) pour plus de détails).
- _Admin_ : utilisateur super-admin connecté.

Les accès sont inclusifs, ce qui signifie que la restriction _Authenticated_ inclut nécessairement _Owner_ et _Admin_.

## Champs

Un modèle contient une liste de champs. Chaque champ est défini par :

- un nom
- un type
- un sous-type (facultatif)
- un ensemble d'attributs (comportementaux).

### Types et sous-types

Les types disponibles sont :

- `string`
  - `email`, `password`, `url`, `text`, `rich`
- `number`
  - `integer`, `float`, `latitude`, `longitude`
- `boolean`
- `datetime`
  - `date`, `time`
- `enum`
- `entity` (référence à un autre modèle)
  - `oneOne`, `oneMany`, `manyOne`, `manyMany`
- `object`
- `file`
  - `image`, `video`, `audio`, `document`

### Attributs de champ

- **Primary** : le champ est la clé primaire.

- **Unique** : le champ contient des valeurs uniques, nécessaires pour éviter les doublons. Un modèle peut avoir plusieurs clés uniques. (par exemple : le courriel de l'utilisateur ou le code du coupon).

- **Label** : le champ est un identifiant lisible. (par exemple : `Prénom` et `Nom` de l'utilisateur, un titre de film).

- **Nullable** : le champ peut contenir une valeur vide. En d'autres termes, il n'est pas obligatoire.

- **Multiple** : ce champ ne contiendra pas une seule valeur mais une liste de valeurs ou de références.

- **Embedded** : possibilité d'imbriquer des données provenant d'une entité liée. Cela peut être utilisé pour imbriquer les formulaires par exemple.

- **Searchable** : possibilité d'effectuer des recherche via ce champ.

- **Sortable** : possibilité de trier les résultats de recherche en fonction de ce champ.

- **Hidden** : ce champ ne doit jamais être envoyé à l'utilisateur final. (par exemple : le mot de passe de l'utilisateur).

- **Internal** : valeur définie en interne par le système, que l'utilisateur final ne peut pas définir (ex. : date de création de l'entité, clé primaire, etc.).

- **Restricted** : défini si l'accès aux données (lecture et/ou écriture) est limité à des utilisateurs spécifiques (par exemple : le statut `validé` peut être défini par un administrateur uniquement).

- **Ownership** : définit l'identité du ou des propriétaires de l'entité (par exemple : un établissement avec un champ `owner` contenant l'ID de l'utilisateur).
