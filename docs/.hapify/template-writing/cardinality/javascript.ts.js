let output = '';
output += `class ${model.names.pascal} extends BaseModel {
    ${getRelations()}
}`;

function getRelations() {
    return model.fields.filter(f => f.type === 'entity').reduce((acc, field) => {
        return acc + getRelation(field) + '\n\t';
    }, '');
}

function getRelation(field) {
    let method = '';
    if (field.subtype === 'oneOne' || field.subtype === 'oneMany') {
        method = 'findOne';
    } else if (field.subtype === 'manyMany') {
        method = 'findMany';
    } else {
        return '';
    }
    return `get${field.names.pascal}() {
        return this.${field.model.names.camel}Store.${method}(this.properties.${field.names.camel});
    }`;
}

return output;