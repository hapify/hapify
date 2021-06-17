output = '';
for (const field of model.fields.list) {
    if (field.meta.plural) {
        output += `// Plural of ${field.names.camel} is ${field.meta.plural.camel}\n`;
    }
}
return output;
