return `class ${model.names.pascal} {
    private primaryKey = '${model.fields.primary.names.snake}';
}`;