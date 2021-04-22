let output = '';
if (model.hasNotes) { output += `// ${model.notes}\n`; }
output += `export class ${model.names.pascal} {
${getFields()}}`;

function getFields() {
    let fields = '';
    for (const field of model.fields.list) {
        fields += `    public ${field.names.camel};`;
        if (field.hasNotes) { fields += ` // ${field.notes}`; }
        fields += `\n`;
    }
    return fields;
}
return output