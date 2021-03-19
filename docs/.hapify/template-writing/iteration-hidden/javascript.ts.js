let output = '';
const hiddenFieldsNames = model.fields
    .filter(f => f.hidden)
    .map(f => `'${f.names.camel}'`);
output += `const hiddenFields = [
    ${hiddenFieldsNames.join(",\n\t")}
];`;
return output;