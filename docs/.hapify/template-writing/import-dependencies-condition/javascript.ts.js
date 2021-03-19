let output = '';
for (let dep of model.dependencies.filter(f => !f.hidden)) {
    output += `import {${dep.names.pascal}} from '../${dep.names.kebab}';\n`;
}
return output;