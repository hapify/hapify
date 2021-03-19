Ce document présente des exemples de code afin de vous aider à jouer avec les templates JavaScript.

## Pré-requis

Avant de lire cet article, nous vous recommandons de lire la documentation sur les [templates JavaScript](../reference/ejs-javascript.md).

## Créer des index pour MongoDB

Ce template produira un JSON contenant tous les index qui doivent être créés dans MongoDB en fonction des attributs du champ.
Il crée un index pour les champs recherchables ou triables ou les références.
Il crée également un index unique pour les champs uniques et un index texte pour les champs de type string recherchable.

=== "JavaScript"

    ```javascript
    /** Generate indexes for a model */
    function _model(out, model) {
    
        const modelName = model.names.snake;
    
        const strings = { fields: {} };
        const uniques = {
            fields: {},
            options: { unique: true }
        };
    
    
        // Even if no fields have indexes, Include this collection
        // Get fields objects
        out[modelName] = model.fields.list.reduce((p, field) => {
    
            // Non primary fields
            if (field.primary) {
                return p;
            }
    
            // Only if the field is searchable, sortable a reference or is unique
            if (!(field.sortable || field.searchable || field.type === 'entity' || field.unique)) {
                return p;
            }
    
            const fieldName = field.names.snake;
    
            // Special text index for strings
            if (field.type === 'string' && field.searchable) {
                strings.fields[fieldName] = 'text';
            }
    
            // Normal indexes
            p[`${modelName}_${fieldName}`] = { fields: { [fieldName]: 1 } };
    
            if (field.unique) {
                p[`${modelName}_${fieldName}`].options = { unique: true };
                uniques.fields[fieldName] = 1;
            }
    
            return p;
        }, {});
    
        // Add labels
        if (Object.keys(strings.fields).length > 0) {
            out[modelName][`${modelName}__text`] = strings;
        }
    
        // Optimize unique indexes
        if (Object.keys(uniques.fields).length > 1) {
            // Remove unique from other indexes
            model.fields.unique.map(field => {
                const fieldName = field.names.snake;
                if (out[modelName][`${modelName}_${fieldName}`]) {
                    delete out[modelName][`${modelName}_${fieldName}`].options;
                }
            });
            // Add unique
            out[modelName][`${modelName}__uniques`] = uniques;
        }
    
        return out;
    }
    
    const _output = models.reduce(_model, {});
    return JSON.stringify(_output, null, 2);
    ```

=== "Sortie"

    ```json
    {
      "service": {
        "service_created_at": {
          "fields": {
            "created_at": 1
          }
        },
        "service_name": {
          "fields": {
            "name": 1
          },
          "options": {
            "unique": true
          }
        },
        "service__text": {
          "fields": {
            "name": "text"
          }
        }
      },
      "user": {
        "user_created_at": {
          "fields": {
            "created_at": 1
          }
        },
        "user_name": {
          "fields": {
            "name": 1
          }
        },
        "user_email": {
          "fields": {
            "email": 1
          },
          "options": {
            "unique": true
          }
        },
        "user_role": {
          "fields": {
            "role": 1
          }
        },
        "user_banned": {
          "fields": {
            "banned": 1
          }
        },
        "user__text": {
          "fields": {
            "name": "text",
            "email": "text",
            "role": "text"
          }
        }
      }
    }
    ```

## Générer une description du modèle de données en JSON

Ce template produira un JSON qui liste les champs et résout les dépendances entre les modèles.

=== "JavaScript"

    ```javascript
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
    ```

=== "Sortie"

    ```json
    [
        {
            "collection": "bookmark",
            "dependencies": [
                "user",
                "place"
            ],
            "fields": [
                {
                    "name": "_id",
                    "notes": null,
                    "type": "string",
                    "subtype": null,
                    "properties": [
                        "primary",
                        "internal"
                    ]
                },
                {
                    "name": "created_at",
                    "notes": null,
                    "type": "datetime",
                    "subtype": null,
                    "properties": [
                        "sortable",
                        "internal"
                    ]
                },
                {
                    "name": "owner",
                    "notes": "Current user when creating the bookmark",
                    "type": "entity",
                    "subtype": null,
                    "properties": [
                        "unique",
                        "searchable",
                        "internal",
                        "ownership"
                    ],
                    "reference": "user"
                },
                {
                    "name": "place",
                    "notes": null,
                    "type": "entity",
                    "subtype": null,
                    "properties": [
                        "unique",
                        "searchable"
                    ],
                    "reference": "place"
                }
            ]
        }
    ]
    ```
