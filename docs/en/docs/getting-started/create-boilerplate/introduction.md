## Summary

In this section you will learn how to create your own [boilerplate](../terminology.md) with Hapify.

You can start a boilerplate from scratch or use a pre-existing boilerplate.

This section focuses on writing [templates](../terminology.md) code.
Since Hapify is an agnostic framework engine and is not limited to a specific framework, we will not focus on the boilerplate structure itself.
We will look at some common template examples.

!!! tip "Tip"
    If your boilerplate uses `npm` or `yarn` as a package manager,
    you can add the `CLI` as a development dependency: `npm install --save-dev @hapify/cli`.
    Also add a script in `package.json`: `"hpf": "hpf"`.
    This way you can define a version of Hapify for your boilerplate and use it with `npm run hpf`.

## Template engines

Hapify offers three template engines.
A boilerplate can use several engines simultaneously.

These engines have access to the [model object](../../reference/model-object.md).
This object, injected into the templates, makes the data model and all its properties and relationships explicit, so that they are easily accessible within the template.

### Hapify template engine

This syntax is optimized to play with the [model object](../../reference/model-object.md) and its properties using short words.
This allows you to handle complex ideas with simple sentences.

This syntax has two variants:

- **long** : easy to read
- **short** : based on abbreviations
 
Both variants can be used in the same template.

#### Example

This loop in JavaScript:

```javascript
for (let f of model.fields.list.filter(f => f.searchable && f.type === 'entity')) {
	out += 'Field name: ' + f.names.camel;
}
```

Will be written like this with the Hapify syntax:

=== "Long syntax"

    ```hapify
    <<for Fields searchable and entity f>>
        Field name: <<f camel>>
    <<endfor>>
    ```

=== "Short syntax"

    ```hapify
    <<@ F se*tE f>>
        Field name: <<f aA>>
    <<@>>
    ```

!!! success "Pros"
    - An easy-to-read [meta-code](../terminology.md)
    - A shorter meta-code, making the [target code](../terminology.md) more readable
    - Even shorter with the short variant

!!! failure "Cons"
    - Another syntax to learn, although it is simple
    - The syntax may not handle specific conditions

### EJS engine

You can use [EJS](https://ejs.co/) as a template engine.
All EJS features are available, except the `include` feature.
This feature is intentionally disabled so that templates do not have access to your file system.

#### Example

This loop in JavaScript:

```javascript
for (let f of model.fields.list.filter(f => f.searchable) {
	out += 'Field name: ' + f.names.camel;
}
```

Will be written like this with EJS:

```js
<% for (let f of model.fields.list.filter(f => f.searchable) { %>
	Field name: <%= f.names.camel %>
<% } %>
```

!!! success "Pros"
    - A well-known template engine
    - Handles complex conditions and interpolation properly
    - More flexibility

!!! failure "Cons"
    - Long meta-code, making the target code less readable

### JavaScript engine
 
You can write templates in pure JavaScript.
 
This engine is very useful to generate JSON files.

#### Example

```javascript
const output = models.map((model) => model.names.snake);
return JSON.stringify(output, null, 2);
```

```javascript
const property = (field) => `private ${field.names.camel};`;
return `class ${model.names.pascal} {
    ${model.fields.list.map(property).join('\n    ')}
}`;
```

!!! success "Pros"
    - Powerful when generating configuration files such as JSON
    - Very flexible

!!! failure "Cons"
    - It is hard to differentiate the meta-code from the target code
