# JavaScript templates

You can write templates in JavaScript: in some cases, this is more efficient. For example, to output JSON object or documentation.

## Model object

The templates receive the [model object](../../model-object/) under the `model` (or `m`) variable.
In the case of a multiple-model template, an array of model objects will be available under the `models` (or `m`) variable.

The next block is a JSON export of the model object for a very simple case. Here the `User profile` model has 3 fields including an entity reference.
To keep this JSON as short as possible, we have removed all short codes, many recurrent properties and sub-models details.
This JSON is a partial representation of the real injected model object, but it gives you a good overview of its structure.

If you want to know the complete structure of the model object, you can refer to the [model object documentation](../../model-object/)
or to the TypeScript interface `ExplicitModel` in the `hapify/generator` [source code](https://github.com/hapify/generator/blob/master/src/interfaces.ts).

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

Now we know the model object structure, we can start coding a JavaScript template.

When running the generation, the JavaScript templates are wrapped into a function. Therefore, the code you are writing is the body of this function.
Your code must return a string.

### Single-model template

=== "JavaScript"

    ```javascript
    const fields = model.fields.list;
    const names = fields.map(field => field.names.pascal);
    return `Fields are: ${names.join(', ')}`;
    ```

=== "Sample output"

    ```
    Fields are: Id, CreatedAt, Avatar
    ```

### Multiple-model template

=== "JavaScript"

    ```javascript
    const modelsFields = [];
    for (const model of models) {
        const fields = model.fields.list;
        const names = fields.map(field => field.names.camel);
        modelsFields.push(`Fields of ${model.names.capital} are: ${names.join(', ')}`);
    }
    return modelsFields.join('\n');
    ```

=== "Sample output"

    ```
    Fields of Place Category are: id, createdAt, name, description
    Fields of Product are: id, createdAt, name, description, price, stock, disabled
    Fields of Restaurant are: id, createdAt, name, description, category, address
    ```

### More usages

To read more samples, please refer to [JavaScript code samples](../code-samples/).
