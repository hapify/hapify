output = '';
if (model.meta.plural) {
    output += `// The model's plural name is ${model.meta.plural.camel}`;
}
return output;