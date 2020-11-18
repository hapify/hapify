# Model validator

Your templates cannot handle any combination of model and field properties.
To prevent this, you can associate a model validator to your templates.

## How it works

This validator is written in pure JavaScript. It receives a single model and returns `warnings` and `errors`.

Those warnings and errors will be shown when managing models:

| Warning | Error |
| --- | --- |
| ![Validator - Warning](../assets/validation-warning.png 'Validation warning') | ![Validator - Error](../assets/validation-error.png 'Validation error') |

## Write a validator

When running the model validation, the JavaScript code is wrapped into a function. Therefore, the code you are writing is the body of this function.
You code must return an object like this:

```javascript
return {
    errors: ['Model has no primary key'],
    warnings: []
}
```

### Access model properties

In the validator script, the model is available under the `model` variable.
The `model` variable has this structure:

```json
{
    "id": "bdc6c58e-ec49-9193-6b29-6c75518bc3ad",
    "name": "Bookmark",
    "notes": "A user can only list its own bookmarks",
    "fields": [
        {
            "name": "_id",
            "notes": null,
            "type": "string",
            "subtype": null,
            "reference": null,
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
        }
    ],
    "accesses": {
        "create": "auth",
        "read": "owner",
        "update": "admin",
        "remove": "owner",
        "search": "owner",
        "count": "owner"
    }
}
```

Unlike JavaScript template, the model properties are not pre-computed and you don't have access to the model dependencies.

## Validator sample

Here is a validator sample that sends a warning for unsupported field type, and an error if primary key is malformed.

```javascript
// Model object is injected as "model"
const errors = [];
const warnings = [];

// -----------------------------
// File fields
if (model.fields.filter((f) => f.type === 'file').length) {
    errors.push('File fields are not supported yet by this boilerplate');
}
// URL fields
if (model.fields.filter((f) => f.type === 'string' && f.subtype === 'url').length) {
    warnings.push('URL string is not supported yet and will be handle as default string');
}

// -----------------------------
// Primary key
const primaries = model.fields.filter((f) => f.primary);
if (primaries.length > 1) {
    errors.push('Only one field can be primary');
}
const primary = primaries[0];
if (primary) {
    if (primary.name !== '_id') {
        errors.push('Primary key must be called "_id"');
    }
    if (primary.type !== 'string') {
        errors.push('Primary key must be a string');
    }
    if (!primary.internal) {
        errors.push('Primary key must be a internal');
    }
} else {
    errors.push('Primary key is required');
}

return {
    errors,
    warnings,
};
```
