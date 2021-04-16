'use strict';

// Errors bucket
const errors = [];
const warnings = [];

// Model object is injected as "model"

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
		errors.push('Primary key cannot be private');
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
	errors.push('Embedded fields cannot be private');
}

return {
	errors,
	warnings,
};
