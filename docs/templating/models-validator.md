# Models validator

Your templates cannot handle any combination of models and fields properties.
To prevent this, you can associate a models validator to your templates.

## How it works

This validator is written in pure JavaScript. It receives a single model and returns `warnings` and `errors`.

Those warnings and errors will be shown when managing models:

## Write a validator

When running the model validation, the JavaScript code is wrapped into a function. Therefore, the code you are writing is the body of this function.
You code must return an object like this:

```javascript
return {
    errors: ['Model has no primary key'],
    warnings: []
}
```

## Validator sample

```javascript
// Errors bucket
const errors = [];
const warnings = [];

// Model object is injected as "model"

// ###########################################################
//  GLOBAL
// ###########################################################
// -----------------------------
// File fields
if (model.fields.filter((f) => f.type === 'file').length) {
    errors.push('File fields are not supported yet by this boilerplate');
}
// URL fields
if (model.fields.filter((f) => f.type === 'string' && f.subtype === 'url').length) {
    warnings.push('URL string is not supported yet and will be handle as default string');
}


// ###########################################################
//  ROUTES
// ###########################################################
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
    if (primary.nullable) {
        errors.push('Primary key cannot be nullable');
    }
    if (primary.multiple) {
        errors.push('Primary key cannot be multiple');
    }
    if (primary.hidden) {
        errors.push('Primary key cannot be hidden');
    }
    if (primary.searchable) {
        errors.push('Primary key cannot be searchable');
    }

    if (primary.unique) {
        warnings.push('Primary key as unique will be ignored');
    }
    if (primary.label) {
        warnings.push('Primary key as label will be ignored');
    }
} else {
    errors.push('Primary key is required');
}

// -----------------------------
// Multiple fields
if (model.fields.filter((f) => f.multiple && f.type !== 'entity').length) {
    errors.push('Multiple fields can only be entities references');
}

// -----------------------------
// Embedded fields
if (model.fields.filter((f) => f.embedded && f.type !== 'entity').length) {
    errors.push('Embedded fields can only be entities references');
}
if (model.fields.filter((f) => f.embedded && f.hidden).length) {
    errors.push('Embedded fields cannot be hidden');
}

// -----------------------------
// Password fields
if (model.fields.filter((f) => f.type === 'string' && f.subtype === 'password' && !f.hidden).length) {
    warnings.push('Passwords should be hidden');
}

// -----------------------------
// Restricted fields
if (model.fields.filter((f) => f.restricted && f.internal).length) {
    warnings.push('A fields cannot be internal and restricted');
}

// -----------------------------
// Owner fields
if (model.fields.filter((f) => f.ownership).length > 1) {
    errors.push('Only one field can be ownership');
}
if (model.fields.filter((f) => f.ownership && f.type !== 'entity' && !f.primary).length > 0) {
    errors.push('Ownership field must be an entity');
}
if (model.fields.filter((f) => f.ownership && !f.primary).length && model.accesses.create === 'guest') {
    errors.push('Model with ownership cannot be created as guest');
}
let hasOwnerAccess = false;
for (const action in model.accesses) {
    if (model.accesses[action] === 'owner') {
        hasOwnerAccess = true;
        break;
    }
}
if (hasOwnerAccess && model.fields.filter((f) => f.ownership).length === 0) {
    errors.push('Model with owner access must have a ownership field');
}

// -----------------------------
// Object fields
if (model.fields.filter((f) => f.type === 'object' && (f.searchable || f.sortable)).length) {
    errors.push('Object cannot be searchable nor sortable');
}

// -----------------------------
// Accesses
if ((model.accesses.search === 'owner' || model.accesses.count === 'owner') && model.accesses.search !== model.accesses.count) {
    errors.push('Search and count actions access must be both "owner" or none.');
}

// ###########################################################
//  MONGO
// ###########################################################
// -----------------------------
// Multiple fields
if (model.fields.filter((f) => f.label && f.type !== 'string').length) {
    errors.push('Label fields can only be string');
}

return {
    errors,
    warnings,
};
```
