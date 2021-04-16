return JSON.stringify(
	{
		models: models.map((model) => model.names.pascal),
	},
	null,
	2
);
