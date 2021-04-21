
Hapify offre la possibilité d'écrire des templates avec la syntaxe [EJS](https://ejs.co/) ou bien en JavaScript pur.
Ces deux options se basent sur le même objet décrit ci-dessous.

## Objet modèle

Les templates de type `one model` reçoivent [l'objet modèle](./model-object.md) via la variable `model` (alias `m`).
Dans le cas d'un template de type `all models`, un tableau d'objets modèles sera disponible via la variable `models` (alias `m`).

Le bloc suivant est une représentation en JSON de cet objet modèle pour un cas très simple. Ici, le modèle `User profile` possède 3 champs dont une référence à une entité.
Pour garder ce JSON aussi court que possible, nous avons supprimé tous les alias, de nombreuses propriétés récurrentes et les détails des sous-modèles.
Ce JSON est une représentation partielle de l'objet modèle réellement injecté, mais il vous donne un bon aperçu de sa structure.

!!! seealso "Voir aussi"
    Si vous voulez connaître la structure complète de l'objet modèle, vous pouvez vous référer à la [documentation de l'objet modèle](./model-object.md),
    ou bien à l'interface TypeScript `ExplicitModel` dans le [code source](https://github.com/hapify/hapify/blob/master/packages/generator/src/Interfaces.ts) de `hapify/generator`.

```json
{
  "id": "b0993d03-70d1-0448-1eef-25bde4818d15",
  "name": "User profile",
  "names": {
    "raw": "User profile",
    "kebab": "user-profile",
    "snake": "user_profile",
    "header": "User-Profile",
    "constant": "USER_PROFILE",
    "big": "USER-PROFILE",
    "capital": "User Profile",
    "lower": "user profile",
    "upper": "USER PROFILE",
    "compact": "userprofile",
    "pascal": "UserProfile",
    "camel": "userProfile"
  },
  "notes": "The user's details",
  "hasNotes": true,
  "fields": {
    "list": [
      {
        "names": {
          "raw": "_id",
          "kebab": "-id",
          "snake": "_id",
          "header": "-Id",
          "constant": "_ID",
          "big": "-ID",
          "capital": "_Id",
          "lower": "_id",
          "upper": "_ID",
          "compact": "id",
          "pascal": "Id",
          "camel": "id"
        },
        "name": "_id",
        "notes": "",
        "hasNotes": false,
        "type": "string",
        "subtype": null,
        "value": null,
        "primary": true,
        "unique": false,
        "label": false,
        "nullable": false,
        "multiple": false,
        "embedded": false,
        "searchable": false,
        "sortable": false,
        "hidden": false,
        "internal": true,
        "restricted": false,
        "ownership": false
      },
      {
        "names": {
          "raw": "created at",
          "kebab": "created-at",
          "snake": "created_at",
          "header": "Created-At",
          "constant": "CREATED_AT",
          "big": "CREATED-AT",
          "capital": "Created At",
          "lower": "created at",
          "upper": "CREATED AT",
          "compact": "createdat",
          "pascal": "CreatedAt",
          "camel": "createdAt"
        },
        "name": "created at",
        "notes": "",
        "hasNotes": false,
        "type": "datetime",
        "subtype": null,
        "value": null,
        "primary": false,
        "unique": false,
        "label": false,
        "nullable": false,
        "multiple": false,
        "embedded": false,
        "searchable": false,
        "sortable": true,
        "hidden": false,
        "internal": true,
        "restricted": false,
        "ownership": false
      },
      {
        "names": {
          "raw": "avatar",
          "kebab": "avatar",
          "snake": "avatar",
          "header": "Avatar",
          "constant": "AVATAR",
          "big": "AVATAR",
          "capital": "Avatar",
          "lower": "avatar",
          "upper": "AVATAR",
          "compact": "avatar",
          "pascal": "Avatar",
          "camel": "avatar"
        },
        "name": "avatar",
        "notes": "",
        "hasNotes": false,
        "type": "entity",
        "subtype": null,
        "value": "ac046aac-7a20-de65-2209-57e80a2bbea4",
        "primary": false,
        "unique": false,
        "label": false,
        "nullable": false,
        "multiple": false,
        "embedded": false,
        "searchable": false,
        "sortable": false,
        "hidden": false,
        "internal": false,
        "restricted": false,
        "ownership": false,
        "model": "// Avatar model details..."
      },
      {
        "names": {
          "raw": "role",
          "kebab": "role",
          "snake": "role",
          "header": "Role",
          "constant": "ROLE",
          "big": "ROLE",
          "capital": "Role",
          "lower": "role",
          "upper": "ROLE",
          "compact": "role",
          "pascal": "Role",
          "camel": "role"
        },
        "name": "role",
        "notes": "restricted to admins",
        "hasNotes": true,
        "type": "enum",
        "subtype": null,
        "value": ["admin", "user", "customer"],
        "primary": false,
        "unique": false,
        "label": false,
        "nullable": false,
        "multiple": false,
        "embedded": false,
        "searchable": true,
        "sortable": false,
        "hidden": false,
        "internal": false,
        "restricted": false,
        "ownership": false,
        "enum": [
            {
              "name": "admin",
              "names": {
                "raw": "admin",
                "kebab": "admin",
                "snake": "admin",
                "header": "Admin",
                "constant": "ADMIN",
                "big": "ADMIN",
                "capital": "Admin",
                "lower": "admin",
                "upper": "ADMIN",
                "compact": "admin",
                "pascal": "Admin",
                "camel": "admin"
              }
            },
            "// Same structure for each enum"
          ]
        }
    ],
    "primary": "// Primary field details...",
    "unique": ["// unique fields details (if any)..."],
    "label": ["// label fields details (if any)..."],
    "nullable": ["// nullable fields details (if any)..."],
    "multiple": ["// multiple fields details (if any)..."],
    "embedded": ["// embedded fields details (if any)..."],
    "searchable": ["// searchable fields details (if any)..."],
    "sortable": ["// sortable fields details (if any)..."],
    "hidden": ["// hidden fields details (if any)..."],
    "internal": ["// internal fields details (if any)..."],
    "restricted": ["// internal fields details (if any)..."],
    "ownership": ["// ownership fields details (if any)..."],
    "searchableLabel": ["// searchableLabel fields details (if any)..."],
    "references": ["// references fields details (if any)..."]
  },
  "properties": {
    "fieldsCount": 3,
    "hasPrimary": true,
    "hasUnique": false,
    "hasLabel": false,
    "hasNullable": false,
    "hasMultiple": false,
    "hasEmbedded": false,
    "hasSearchable": false,
    "hasSortable": true,
    "hasHidden": false,
    "hasInternal": true,
    "hasRestricted": false,
    "hasOwnership": false,
    "hasSearchableLabel": false,
    "mainlyHidden": false,
    "mainlyInternal": true,
    "isGeolocated": false,
    "isGeoSearchable": false,
    "hasDependencies": true,
    "isReferenced": false
  },
  "accesses": {
    "list": [
      {
        "action": "create",
        "admin": false,
        "owner": false,
        "auth": false,
        "guest": true,
        "gteAdmin": true,
        "gteOwner": true,
        "gteAuth": true,
        "gteGuest": true,
        "lteAdmin": false,
        "lteOwner": false,
        "lteAuth": false,
        "lteGuest": true
      },
      {
        "action": "read",
        "admin": false,
        "owner": false,
        "auth": false,
        "guest": true,
        "gteAdmin": true,
        "gteOwner": true,
        "gteAuth": true,
        "gteGuest": true,
        "lteAdmin": false,
        "lteOwner": false,
        "lteAuth": false,
        "lteGuest": true
      }
    ],
    "properties": {
      "onlyAdmin": false,
      "onlyOwner": false,
      "onlyAuth": false,
      "onlyGuest": true,
      "maxAdmin": false,
      "maxOwner": false,
      "maxAuth": false,
      "maxGuest": true,
      "noAdmin": true,
      "noOwner": true,
      "noAuth": true,
      "noGuest": false,
      "hasAdmin": false,
      "hasOwner": false,
      "hasAuth": false,
      "hasGuest": true
    },
    "admin": [],
    "owner": [],
    "auth": [],
    "guest": [
      {
        "action": "create",
        "admin": false,
        "owner": false,
        "auth": false,
        "guest": true,
        "gteAdmin": true,
        "gteOwner": true,
        "gteAuth": true,
        "gteGuest": true,
        "lteAdmin": false,
        "lteOwner": false,
        "lteAuth": false,
        "lteGuest": true
      }
    ],
    "create": {
      "action": "create",
      "admin": false,
      "owner": false,
      "auth": false,
      "guest": true,
      "gteAdmin": true,
      "gteOwner": true,
      "gteAuth": true,
      "gteGuest": true,
      "lteAdmin": false,
      "lteOwner": false,
      "lteAuth": false,
      "lteGuest": true
    },
    "read": "// Same structure as create",
    "update": "// Same structure as create",
    "remove": "// Same structure as create",
    "search": "// Same structure as create",
    "count": "// Same structure as create"
  },
  "dependencies": {
    "list": ["// Avatar model details..."],
    "self": false
  },
  "referencedIn": ["// Referring models come here, populated with entity fields only."]
}
```

## Templating

Voici des exemples de template EJS et JavaScript utilisant cet objet modèle.

### Template de type `one model`

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
    
!!! warning "Attention"
    Un template JavaScript doit retourner une chaîne de caractères.

!!! tip "À savoir"
    Les fichiers générés vides ne seront pas sauvegardés.

### Template de type `all models`

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

!!! seealso "Voir aussi"
    Pour plus d'exemples de templates, veuillez lire [cet article](../getting-started/create-boilerplate/step-4-template-writing.md).
