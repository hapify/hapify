let output = '';
for (let model of models) {
    output += `require_once('./${model.names.kebab}.php');\n`;
}
return output;