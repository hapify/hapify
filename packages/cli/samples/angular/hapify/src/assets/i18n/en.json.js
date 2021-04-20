// Static words
let _output = {
	'error_dismiss-action': 'Ok',
	'header_app-name': 'Hapify - Dashboard',
	'header_app-short-name': 'Hapify',
	'header_action-logout': 'Logout',
	'footer_tag-line': '© {{year}} - Tractr',
	'session_sign-in': 'Sign in',
	session_email: 'Email',
	session_password: 'Password',
	home_title: 'Hapify',
	common_empty: 'No results',
	common_true: 'Yes',
	common_false: 'No',
	common_save: 'Save',
	common_edit: 'Edit',
	common_create: 'Create',
	common_delete: 'Delete',
	common_more: 'More...',
	'common_filters-title': 'Filters',
	'common_value-string': 'Value',
	'common_value-number': 'Value',
	'common_value-date': 'Date',
	'common_value-boolean': 'Yes/No',
	'common_value-object': 'Value',
	common_min: 'Minimum',
	common_max: 'Maximum',
	'common_error-required': 'This field is required',
	'common_error-format': 'Wrong format',
	'common_error-min': 'This field need to be greater than {{ min }}',
	'common_error-max': 'This field need to be lower than {{ max }}.',
	'common_error-duplicate': 'An instance of that model already have that values.',
};

/**
 * Generate the read part of a model
 *
 * @param model
 * @private
 */
function __fields(model) {
	const modelKey = model.names.kebab;
	return model.fields.list
		.filter((f) => !((f.hidden && f.internal) || f.primary))
		.reduce((p, f) => {
			const key = f.names.kebab;
			p[`${modelKey}_${key}`] = `${f.names.capital}`;
			return p;
		}, {});
}

/**
 * Generate the Referenced In part of a model
 *
 * @param model
 * @private
 */
function __referenced_in(model) {
	const output = {};
	model.referencedIn.map((r) => {
		r.fields
			.filter((f) => f.searchable)
			.map((f) => {
				const key = `${model.names.snake}_${r.names.snake}-as-${f.names.snake}`;
				output[key] = `${r.names.capital} as ${f.names.capital}`;
			});
	});
	return output;
}

/**
 * Generate the filter of a model
 *
 * @param model
 * @private
 */
function __filter(model) {
	const modelKey = model.names.kebab;
	return model.fields.searchable.reduce((p, f) => {
		const key = f.names.kebab;
		p[`${modelKey}_${key}`] = `${f.names.capital}`;
		if (f.type === 'number' || f.type === 'datetime') {
			p[`${modelKey}_${key}--min`] = `${f.names.capital} min`;
			p[`${modelKey}_${key}--max`] = `${f.names.capital} max`;
		}
		return p;
	}, {});
}

/**
 * Generate the selector of a model
 *
 * @param model
 * @private
 */
function __select(model) {
	const output = {
		[`${model.names.kebab}_common_select-placeholder`]: `Select ${model.names.lower}`,
	};
	if (model.p.hasSearchableLabel) {
		output[`${model.names.kebab}_common_search-placeholder`] = `Search ${model.names.lower}`;
	}
	return output;
}

/**
 * Generate a model
 *
 * @param model
 * @private
 */
function __model(model) {
	const modelKey = model.names.kebab;
	const modelWords = model.names.lower;
	return Object.assign(
		{
			[`${modelKey}_common_name`]: model.names.capital,
			[`${modelKey}_common_not-found`]: `No ${modelWords} found`,
		},
		__filter(model),
		__fields(model),
		__select(model),
		__referenced_in(model)
	);
}

//--------------------------------------------------
//  Output
//--------------------------------------------------
models.map((model) => {
	const keysUnordered = Object.assign(_output, __model(model));

	_output = Object.keys(keysUnordered)
		.sort()
		.reduce(function (keysOrdered, key) {
			keysOrdered[key] = keysUnordered[key];

			return keysOrdered;
		}, {});
});
return JSON.stringify(_output, null, 2);
