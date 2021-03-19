let output = '';
if (model.fields.filter(f => f.type === 'entity').length > 0) {
    output += `const mongoDb = require('mongodb');`
}
return output;