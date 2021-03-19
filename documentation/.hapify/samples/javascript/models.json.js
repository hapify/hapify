const _output = models.map((m) => {
    return {
        collection: m.names.snake,
        dependencies: m.dependencies.list.map((d) => {
            return d.names.snake
        }),
        fields: m.fields.list.map((f) => {
            const out = {
              name: f.names.snake,
              notes: f.notes,
              type: f.type,
              subtype: f.subtype,
              properties: []
            };
            // Convert boolean properties to list
            for (const prop of Object.keys(f)) {
                if (typeof f[prop] === 'boolean' && f[prop]) {
                    out.properties.push(prop)
                }
            }
            // Append model reference if any
            if (f.model) {
                out.reference = f.model.names.snake;
            }
            return out;
        })
    };
});

return JSON.stringify(_output, null, 4);