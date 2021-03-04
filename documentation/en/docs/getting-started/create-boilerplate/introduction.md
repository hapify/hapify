## Summary

In this sections, you will learn how to create your own boilerplate with Hapify.

You can start a boilerplate from scratch or use an existing one.

This section focuses on code template writing.
As Hapify is language agnostic and is not restricted to a specific framework, we won't focus on the boilerplate structure itself.
We will study common template examples.

## Templating engines

Hapify provides three templating engine.
A boilerplate can mix all of them.

These engines has access to the [model object](../../model-object/).
This object, injected in the templates, explicits the data-model and all its properties and relations, so they can be accessed easily from the template.

### Hapify engine

This syntax is optimized to play with the [model object](../../model-object/) and its properties with short words.
This allows you to manage complex ideas with short sentences.

This syntax has two variants:

- **long**: human readable
- **short**: based on short codes
    
Both variants can be used within the same template.

#### Example

For example, this loop in Javascript:

```javascript
for (let f of model.fields.list.filter(f => f.searchable && f.type === 'entity')) {
	out += 'Field name: ' + f.names.camel;
}
```

Will be written like this with Hapify syntax:

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
    - Easy to read syntax
    - Shorter meta-code, making the target code readable
    - Even shorter with the short variants

!!! failure "Cons"
    - Another syntax to learn, even if simple
    - The syntax may not handle some specific conditions

### EJS engine

You can use EJS as templating engine.
All features of EJS are available except the `include` feature.
This feature is disabled on purpose so the templates has no access to your file system.

#### Example

For example, this loop in Javascript:

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
    - Well known template engine
    - Handle complex conditions and interpolation
    - More flexibility

!!! failure "Cons"
    - Long meta-code, making the target code less readable

### JavaScript engine

You can write templates in vanilla JavaScript.

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
    - Powerful when generating config files such as JSON
    - Very flexibile

!!! failure "Cons"
    - Hard to differentiate meta-code from target code.
