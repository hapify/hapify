
Hapify offers the possibility to write templates with the [EJS](https://ejs.co/) syntax or in pure JavaScript.
Both options are based on the same object described below.

## Model object

Templates of type `one model` receive [the model object](./model-object.md) via the `model` variable (alias `m`).
In the case of a template of type `all models`, an array of model objects will be available via the `models` variable (alias `m`).

The following block is a JSON representation of this model object for a very simple case. Here, the `User profile` model has 3 fields including a reference to an entity.
To keep this JSON as short as possible, we have removed all aliases, many recurring properties and sub-model details.
This JSON is a partial representation of the actual injected model object, but it gives you a good overview of its structure.

!!! seealso "See also"
    If you want to know the complete structure of the model object, you can refer to the [model object documentation](./model-object.md),
    or to the TypeScript interface `ExplicitModel` in the [source code](https://github.com/hapify/generator/blob/master/src/interfaces.ts) of `hapify/generator`.

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
        "notes": null,
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
        "notes": null,
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
        "notes": null,
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
        "notes": null,
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

Here are examples of EJS and JavaScript templates using this model object.

### Template of type `one model

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
    
!!! warning "Warning"
    A JavaScript template must return a string.

!!! tip "Tip"
    Empty generated files will not be saved.

### Template of type `all models`

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

!!! seealso "See also"
    For more examples, please read [this article](../getting-started/create-boilerplate/step-4-template-writing.md).
