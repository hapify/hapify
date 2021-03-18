let output = '';
for (let field of model.fields.filter(f => f.internal)) {
    output += `$default${field.names.pascal} = ${getDefaultValue(field)};\n`
}
return output;

function getDefaultValue(field) {
    switch (field.type) {
        case 'boolean':
            return 'false';
        case 'string':
            return "''";
        case 'number':
            return '0';
        default:
            return 'NULL';
    }
}