let output = '';
if (model.accesses.create.lteAuth) {
    output += `const user = Session.getCurrent();`
}
return output;