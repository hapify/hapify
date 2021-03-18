let output = '';
for (let dep of model.dependencies.list) {
    output += `import {${dep.names.pascal}} from '../${dep.names.kebab}';\n`;
}
return output;