# Hapify Generator

## Description

This package allows you to generate code using Hapify models and Hapify or JavaScript code templates.

## Usage

```typescript
import { Generator } from '@hapify/generator';

const templates = [
    {
    	path: '/path/to/{snake}',
    	engine: 'hpf',
    	input: 'one',
        content: 'Camel case is <<Model camel>>.',
    }
];
const models = [
    {
        id: 'bdc6c58e-ec49-9193-6b29-6c75518bc3ad',
        name: 'Place bookmark',
        notes: 'A user can only list its own bookmarks',
        fields: [
            {
                name: '_id',
                notes: null,
                type: 'string',
                subtype: null,
                value: null,
                primary: true,
                unique: false,
                label: false,
                nullable: false,
                multiple: false,
                embedded: false,
                searchable: false,
                sortable: false,
                hidden: false,
                internal: true,
                restricted: false,
                ownership: false
            }
        ],
        accesses: {
            create: 'auth',
            read: 'owner',
            update: 'admin',
            remove: 'owner',
            search: 'owner',
            count: 'owner'
        }
    }
];

// Get path & content
Generator.run(templates, models)
    .then(results => {
        // [{ path: '/path/to/place_bookmark', content: 'Camel case is placeBookmark' }]
    });

// Get path only
const path = Generator.path('/path/to/{camel}', models[0]); // '/path/to/placeBookmark'
```

## More

For more information about this module, please refer to the [online documentation](https://docs.hapify.io/).
