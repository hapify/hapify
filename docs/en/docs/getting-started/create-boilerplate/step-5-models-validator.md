Your templates cannot handle any combination of fields and attributes.
To prevent this, you can associate a data model validator to your templates.

## How does it work?

This validator is written in pure JavaScript. It receives a single data model and returns `warnings` and `errors`.

These warnings and errors will be displayed during data model management:

| Warnings | Errors |
| --- | --- |
| ![Validator - Warning](../../assets/validation-warning.jpg 'Validation warning') | ![Validator - Error](../../assets/validation-error.jpg 'Validation error') |

## Write a validator

When validating the data model, the JavaScript code is wrapped into a function. Therefore, the code you are writing is the body of that function.
Your code must return an object like this:

```javascript
return {
    errors: ['Model has no primary key'],
    warnings: []
}
```

### Accessing the data model properties

In the validator script, the data model is available under the `model` variable.
The `model` variable is structured like this:

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

Unlike the JavaScript template engine, the data model properties are not pre-computed and you do not have access to the data model dependencies.

## Example of validator

Here is an example of a validator that sends a warning for an unsupported field type, and an error if the primary key is not compliant.

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

// -----------------------------
// Meta values
if (!model.meta.plural) {
    errors.push('Plural name is required');
}

return {
    errors,
    warnings,
};
```
