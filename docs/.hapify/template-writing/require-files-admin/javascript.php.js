let output = '';
for (let model of models.filter(m => m.accesses.properties.onlyAdmin)) {
    output += `require_once('./${model.names.kebab}.php');\n`;
}
return output;