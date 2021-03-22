let output = '';
for (let field of model.fields.filter(f => f.type === 'enum')) {
    const enums = field.enum.map(e => `'${e.names.constant}'`);
    output += `const ${field.names.camel}Values = [
    ${enums.join(',\n\t')}
];`;
}
return output;
