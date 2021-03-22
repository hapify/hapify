let output = '';
for (let referrer of model.referencedIn) {
    for (let field of referrer.fields) {
        output += `await db.collection('${referrer.names.pascal}').deleteMany({ ${field.names.snake}: id });\n`;
    }
}
return output;