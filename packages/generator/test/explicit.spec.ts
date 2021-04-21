import { expect } from '@hapi/code';

import 'mocha';
import { Generator } from '../src';
import {
  Access,
  Accesses,
  Action,
  ExplicitAccesses,
  ExplicitDeepModelFields,
  ExplicitDeepModelProperties,
  ExplicitModelAccessProperties,
  Field,
  Model,
  StringVariations,
  Template,
} from '../src/Interfaces';

const getModels = (
  fieldsOverrides: Partial<Field>[] = [{}],
  accessesOverrides: Partial<Accesses> = {},
): Model[] => {
  const names = [
    'name',
    'price',
    'created at',
    'forbidden',
    'visible',
    'closed at',
    'description',
  ];
  const fields: Field[] = [];

  for (let i = 0; i < fieldsOverrides.length; i++) {
    fields.push({
      name: names[i % names.length],
      type: 'string',
      subtype: null,
      value: null,
      primary: false,
      unique: false,
      label: false,
      nullable: false,
      multiple: false,
      embedded: false,
      searchable: false,
      sortable: false,
      hidden: false,
      internal: false,
      restricted: false,
      ownership: false,
      ...fieldsOverrides[i],
    });
  }
  return [
    {
      id: `0cf80d75-abcd-f8c7-41f6-ed41c6425aa1`,
      name: 'User profile',
      notes: 'this is a comment',
      fields,
      accesses: {
        create: 'guest',
        read: 'guest',
        update: 'guest',
        remove: 'guest',
        search: 'guest',
        count: 'guest',
        ...accessesOverrides,
      },
    },
  ];
};
const getTemplates = (content = ''): Template[] => [
  {
    path: 'index.js',
    engine: 'js',
    input: 'one',
    content,
  },
];

describe('model names', () => {
  const variations: { name: keyof StringVariations; value: string }[] = [
    { name: 'raw', value: 'User profile' },
    { name: 'kebab', value: 'user-profile' },
    { name: 'snake', value: 'user_profile' },
    { name: 'header', value: 'User-Profile' },
    { name: 'constant', value: 'USER_PROFILE' },
    { name: 'big', value: 'USER-PROFILE' },
    { name: 'capital', value: 'User Profile' },
    { name: 'lower', value: 'user profile' },
    { name: 'upper', value: 'USER PROFILE' },
    { name: 'compact', value: 'userprofile' },
    { name: 'pascal', value: 'UserProfile' },
    { name: 'camel', value: 'userProfile' },
  ];

  for (const variation of variations) {
    it(variation.name, async () => {
      const templates = getTemplates(`return model.names.${variation.name};`);
      const response1 = await Generator.run(templates, getModels());
      expect(response1.length).to.equal(1);
      expect(response1[0].content).to.equal(variation.value);
    });
  }

  it('model.name', async () => {
    const templates = getTemplates(`return model.name;`);
    const response1 = await Generator.run(templates, getModels());
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('User profile');
  });
});

describe('model notes', () => {
  it('model.notes', async () => {
    const templates = getTemplates(
      `return model.hasNotes ? model.notes : 'No notes';`,
    );
    // With note
    const models = getModels();
    const response1 = await Generator.run(templates, models);
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('this is a comment');
    // Without notes
    delete models[0].notes;
    const response2 = await Generator.run(templates, models);
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('No notes');
  });
});

describe('field names', () => {
  const variations: { name: keyof StringVariations; value: string }[] = [
    { name: 'raw', value: 'Created at' },
    { name: 'kebab', value: 'created-at' },
    { name: 'snake', value: 'created_at' },
    { name: 'header', value: 'Created-At' },
    { name: 'constant', value: 'CREATED_AT' },
    { name: 'big', value: 'CREATED-AT' },
    { name: 'capital', value: 'Created At' },
    { name: 'lower', value: 'created at' },
    { name: 'upper', value: 'CREATED AT' },
    { name: 'compact', value: 'createdat' },
    { name: 'pascal', value: 'CreatedAt' },
    { name: 'camel', value: 'createdAt' },
  ];

  for (const variation of variations) {
    it(variation.name, async () => {
      const templates = getTemplates(
        `return model.fields.list[0].names.${variation.name};`,
      );
      const response1 = await Generator.run(
        templates,
        getModels([{ name: 'Created at' }]),
      );
      expect(response1.length).to.equal(1);
      expect(response1[0].content).to.equal(variation.value);
    });
  }
});

describe('fields list', () => {
  const types: {
    name: keyof ExplicitDeepModelFields;
    short: keyof ExplicitDeepModelFields;
  }[] = [
    { name: 'primary', short: 'pr' },
    { name: 'unique', short: 'un' },
    { name: 'label', short: 'lb' },
    { name: 'nullable', short: 'nu' },
    { name: 'multiple', short: 'ml' },
    { name: 'embedded', short: 'em' },
    { name: 'searchable', short: 'se' },
    { name: 'sortable', short: 'so' },
    { name: 'hidden', short: 'hd' },
    { name: 'internal', short: 'in' },
    { name: 'restricted', short: 'rs' },
    { name: 'ownership', short: 'os' },
  ];

  for (const type of types) {
    it(type.name, async () => {
      const templates =
        type.name === 'primary'
          ? getTemplates(
              `return typeof model.fields.${type.name} !== 'undefined' ? 'yes': 'no';`,
            )
          : getTemplates(
              `return model.fields.${type.name}.length > 0 ? 'yes': 'no';`,
            );
      const response1 = await Generator.run(
        templates,
        getModels([{ [type.name]: true }]),
      );
      expect(response1.length).to.equal(1);
      expect(response1[0].content).to.equal('yes');

      const response2 = await Generator.run(templates, getModels());
      expect(response2.length).to.equal(1);
      expect(response2[0].content).to.equal('no');
    });
    it(type.short, async () => {
      const templates =
        type.name === 'primary'
          ? getTemplates(
              `return typeof model.fields.${type.short} !== 'undefined' ? 'yes': 'no';`,
            )
          : getTemplates(
              `return model.fields.${type.short}.length > 0 ? 'yes': 'no';`,
            );
      const response1 = await Generator.run(
        templates,
        getModels([{ [type.name]: true }]),
      );
      expect(response1.length).to.equal(1);
      expect(response1[0].content).to.equal('yes');

      const response2 = await Generator.run(templates, getModels());
      expect(response2.length).to.equal(1);
      expect(response2[0].content).to.equal('no');
    });
  }

  it('searchableLabel', async () => {
    const templates = getTemplates(
      `return model.fields.searchableLabel.length > 0 ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([{ label: true, searchable: true }]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(templates, getModels());
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });
  it('sl', async () => {
    const templates = getTemplates(
      `return model.fields.sl.length > 0 ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([{ label: true, searchable: true }]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(templates, getModels());
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });
});

describe('fields filter', () => {
  it('empty', async () => {
    const templates = getTemplates(`return model.fields.filter().length + '';`);
    const response1 = await Generator.run(templates, getModels([{}, {}, {}]));
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('3');
  });
  it('active', async () => {
    const templates = getTemplates(
      `return model.fields.filter(f => f.hidden).length + '';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([{}, { hidden: true }, {}]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('1');
  });
});

describe('model properties', () => {
  it('fieldsCount', async () => {
    const templates = getTemplates(`return model.properties.fieldsCount + '';`);
    const response1 = await Generator.run(templates, getModels([{}, {}, {}]));
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('3');
  });

  const types: {
    name: keyof ExplicitDeepModelFields;
    prop: keyof ExplicitDeepModelProperties;
  }[] = [
    { name: 'primary', prop: 'hasPrimary' },
    { name: 'unique', prop: 'hasUnique' },
    { name: 'label', prop: 'hasLabel' },
    { name: 'nullable', prop: 'hasNullable' },
    { name: 'multiple', prop: 'hasMultiple' },
    { name: 'embedded', prop: 'hasEmbedded' },
    { name: 'searchable', prop: 'hasSearchable' },
    { name: 'sortable', prop: 'hasSortable' },
    { name: 'hidden', prop: 'hasHidden' },
    { name: 'internal', prop: 'hasInternal' },
    { name: 'restricted', prop: 'hasRestricted' },
    { name: 'ownership', prop: 'hasOwnership' },
  ];

  for (const type of types) {
    it(type.prop, async () => {
      const templates = getTemplates(
        `return model.properties.${type.prop} ? 'yes': 'no';`,
      );
      const response1 = await Generator.run(
        templates,
        getModels([{ [type.name]: true }]),
      );
      expect(response1.length).to.equal(1);
      expect(response1[0].content).to.equal('yes');

      const response2 = await Generator.run(templates, getModels());
      expect(response2.length).to.equal(1);
      expect(response2[0].content).to.equal('no');
    });
  }

  it('hasSearchableLabel', async () => {
    const templates = getTemplates(
      `return model.properties.hasSearchableLabel ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([{ label: true, searchable: true }]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(templates, getModels());
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });

  it('isGeolocated', async () => {
    const templates = getTemplates(
      `return model.properties.isGeolocated ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([
        { type: 'number', subtype: 'latitude' },
        { type: 'number', subtype: 'longitude' },
      ]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(
      templates,
      getModels([{ type: 'number', subtype: 'latitude' }]),
    );
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });

  it('isGeoSearchable', async () => {
    const templates = getTemplates(
      `return model.properties.isGeoSearchable ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([
        { type: 'number', subtype: 'latitude', searchable: true },
        { type: 'number', subtype: 'longitude', searchable: true },
      ]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(
      templates,
      getModels([
        { type: 'number', subtype: 'latitude' },
        { type: 'number', subtype: 'longitude', searchable: true },
      ]),
    );
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });

  it('mainlyHidden', async () => {
    const templates = getTemplates(
      `return model.properties.mainlyHidden ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([{ hidden: true }, { hidden: true }, {}]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(
      templates,
      getModels([{ hidden: true }, {}, {}]),
    );
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });

  it('mainlyInternal', async () => {
    const templates = getTemplates(
      `return model.properties.mainlyInternal ? 'yes': 'no';`,
    );
    const response1 = await Generator.run(
      templates,
      getModels([{ internal: true }, { internal: true }, {}]),
    );
    expect(response1.length).to.equal(1);
    expect(response1[0].content).to.equal('yes');

    const response2 = await Generator.run(
      templates,
      getModels([{ internal: true }, {}, {}]),
    );
    expect(response2.length).to.equal(1);
    expect(response2[0].content).to.equal('no');
  });
});

describe('model accesses', () => {
  // By action
  const actions: Action[] = [
    'create',
    'read',
    'update',
    'remove',
    'search',
    'count',
  ];
  const expectedExplicitAccesses: {
    access: Access;
    expected: { [key in keyof ExplicitAccesses]?: boolean };
  }[] = [
    {
      access: 'guest',
      expected: {
        admin: false,
        owner: false,
        auth: false,
        guest: true,
        gteAdmin: true,
        gteOwner: true,
        gteAuth: true,
        gteGuest: true,
        lteAdmin: false,
        lteOwner: false,
        lteAuth: false,
        lteGuest: true,
      },
    },
    {
      access: 'auth',
      expected: {
        admin: false,
        owner: false,
        auth: true,
        guest: false,
        gteAdmin: true,
        gteOwner: true,
        gteAuth: true,
        gteGuest: false,
        lteAdmin: false,
        lteOwner: false,
        lteAuth: true,
        lteGuest: true,
      },
    },
    {
      access: 'owner',
      expected: {
        admin: false,
        owner: true,
        auth: false,
        guest: false,
        gteAdmin: true,
        gteOwner: true,
        gteAuth: false,
        gteGuest: false,
        lteAdmin: false,
        lteOwner: true,
        lteAuth: true,
        lteGuest: true,
      },
    },
    {
      access: 'admin',
      expected: {
        admin: true,
        owner: false,
        auth: false,
        guest: false,
        gteAdmin: true,
        gteOwner: false,
        gteAuth: false,
        gteGuest: false,
        lteAdmin: true,
        lteOwner: true,
        lteAuth: true,
        lteGuest: true,
      },
    },
  ];

  for (const action of actions) {
    for (const access of expectedExplicitAccesses) {
      for (const key of Object.keys(
        access.expected,
      ) as (keyof ExplicitAccesses)[]) {
        it(`value ${key} for access ${access.access} in ${action}`, async () => {
          const response = await Generator.run(
            getTemplates(
              `return model.accesses.${action}.${key} ? 'yes': 'no';`,
            ),
            getModels([{}], { [action]: access.access }),
          );
          expect(response.length).to.equal(1);
          expect(response[0].content).to.equal(
            access.expected[key] ? 'yes' : 'no',
          );
        });
      }
    }
  }

  // By access
  const actionsForAccessModels = getModels([{}], {
    create: 'admin',
    read: 'auth',
    update: 'owner',
    remove: 'guest',
    search: 'guest',
    count: 'guest',
  });
  const actionsForAccesses: { [key in Access]: Action[] } = {
    admin: ['create'],
    auth: ['read'],
    owner: ['update'],
    guest: ['remove', 'search', 'count'],
  };

  for (const key of Object.keys(actionsForAccesses) as Access[]) {
    it(`filtered actions for ${key}`, async () => {
      const response = await Generator.run(
        getTemplates(
          `return model.accesses.${key}.map(a => a.action).join('-');`,
        ),
        actionsForAccessModels,
      );
      expect(response.length).to.equal(1);
      expect(response[0].content).to.equal(actionsForAccesses[key].join('-'));
    });
  }

  // List
  it(`complete list & filter`, async () => {
    let response;

    response = await Generator.run(
      getTemplates(`return model.accesses.list.map(a => a.action).join('-');`),
      getModels(),
    );
    expect(response.length).to.equal(1);
    expect(response[0].content).to.equal(actions.join('-'));

    response = await Generator.run(
      getTemplates(
        `return model.accesses.filter().map(a => a.action).join('-');`,
      ),
      getModels(),
    );
    expect(response.length).to.equal(1);
    expect(response[0].content).to.equal(actions.join('-'));

    response = await Generator.run(
      getTemplates(
        `return model.accesses.filter(a => a.admin).map(a => a.action).join('-');`,
      ),
      getModels([{}], { search: 'admin', count: 'admin' }),
    );
    expect(response.length).to.equal(1);
    expect(response[0].content).to.equal('search-count');
  });

  const expectedAccessesProperties: {
    access: Access;
    expected: { [key in keyof ExplicitModelAccessProperties]?: boolean };
  }[] = [
    {
      access: 'guest',
      expected: {
        onlyAdmin: false,
        onlyOwner: false,
        onlyAuth: false,
        onlyGuest: true,
        maxAdmin: false,
        maxOwner: false,
        maxAuth: false,
        maxGuest: true,
        noAdmin: true,
        noOwner: true,
        noAuth: true,
        noGuest: false,
        hasAdmin: false,
        hasOwner: false,
        hasAuth: false,
        hasGuest: true,
      },
    },
    {
      access: 'auth',
      expected: {
        onlyAdmin: false,
        onlyOwner: false,
        onlyAuth: true,
        onlyGuest: false,
        maxAdmin: false,
        maxOwner: false,
        maxAuth: true,
        maxGuest: false,
        noAdmin: true,
        noOwner: true,
        noAuth: false,
        noGuest: true,
        hasAdmin: false,
        hasOwner: false,
        hasAuth: true,
        hasGuest: false,
      },
    },
    {
      access: 'owner',
      expected: {
        onlyAdmin: false,
        onlyOwner: true,
        onlyAuth: false,
        onlyGuest: false,
        maxAdmin: false,
        maxOwner: true,
        maxAuth: false,
        maxGuest: false,
        noAdmin: true,
        noOwner: false,
        noAuth: true,
        noGuest: true,
        hasAdmin: false,
        hasOwner: true,
        hasAuth: false,
        hasGuest: false,
      },
    },
    {
      access: 'admin',
      expected: {
        onlyAdmin: true,
        onlyOwner: false,
        onlyAuth: false,
        onlyGuest: false,
        maxAdmin: true,
        maxOwner: false,
        maxAuth: false,
        maxGuest: false,
        noAdmin: false,
        noOwner: true,
        noAuth: true,
        noGuest: true,
        hasAdmin: true,
        hasOwner: false,
        hasAuth: false,
        hasGuest: false,
      },
    },
  ];
  for (const access of expectedAccessesProperties) {
    for (const key of Object.keys(
      access.expected,
    ) as (keyof ExplicitModelAccessProperties)[]) {
      it(`prop ${key} for access ${access.access}`, async () => {
        const response = await Generator.run(
          getTemplates(
            `return model.accesses.properties.${key} ? 'yes': 'no';`,
          ),
          getModels([{}], {
            create: access.access,
            read: access.access,
            update: access.access,
            remove: access.access,
            search: access.access,
            count: access.access,
          }),
        );
        expect(response.length).to.equal(1);
        expect(response[0].content).to.equal(
          access.expected[key] ? 'yes' : 'no',
        );
      });
    }
  }
});

describe('model dependencies & references', () => {
  const model1 = getModels()[0];
  const model2 = getModels([
    {
      type: 'entity',
      value: 'dependency1',
    },
  ])[0];
  const model3 = getModels()[0];
  model1.id = 'no-deps';
  model2.id = 'dependency1';
  model3.id = 'dependency2';

  const model4 = getModels([
    { type: 'entity', value: 'dependency1', hidden: true },
    { type: 'entity', value: 'dependency2' },
    { type: 'entity', value: 'dependency2' }, // Test no duplicate
  ])[0];
  model4.id = 'dependent';
  const models = [model1, model2, model3, model4];

  it(`dependencies list & filter`, async () => {
    let response;

    response = await Generator.run(
      getTemplates(`return model.dependencies.list.map(m => m.id).join(' ');`),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('');
    expect(response[2].content).to.equal('');
    expect(response[3].content).to.equal('dependency1 dependency2');

    response = await Generator.run(
      getTemplates(
        `return model.dependencies.filter().map(m => m.id).join(' ');`,
      ),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('');
    expect(response[2].content).to.equal('');
    expect(response[3].content).to.equal('dependency1 dependency2');

    response = await Generator.run(
      getTemplates(
        `return model.dependencies.filter(f => f.hidden).map(m => m.id).join(' ');`,
      ),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('');
    expect(response[2].content).to.equal('');
    expect(response[3].content).to.equal('dependency1');
  });

  it(`self dependency`, async () => {
    const response = await Generator.run(
      getTemplates(`return model.dependencies.self ? 'yes': 'no';`),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('no');
    expect(response[1].content).to.equal('yes');
    expect(response[2].content).to.equal('no');
    expect(response[3].content).to.equal('no');
  });

  it(`referenced in`, async () => {
    const response = await Generator.run(
      getTemplates(`return model.referencedIn.map(m => m.id).join(' ');`),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('dependency1 dependent');
    expect(response[2].content).to.equal('dependent');
    expect(response[3].content).to.equal('');
  });

  it(`referenced in filter`, async () => {
    const response = await Generator.run(
      getTemplates(
        `return model.ri.f(m => m.id !== 'dependent').map(m => m.id).join(' ');`,
      ),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('dependency1');
    expect(response[2].content).to.equal('');
    expect(response[3].content).to.equal('');
  });

  it(`referenced in fields`, async () => {
    const response = await Generator.run(
      getTemplates(`return model.referencedIn.map(m => m.f.length).join(' ');`),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('1 1');
    expect(response[2].content).to.equal('2');
    expect(response[3].content).to.equal('');
  });

  it(`reference fields`, async () => {
    const response = await Generator.run(
      getTemplates(`return model.f.r.map(f => f.m.id).join(' ');`),
      models,
    );
    expect(response.length).to.equal(4);
    expect(response[0].content).to.equal('');
    expect(response[1].content).to.equal('dependency1');
    expect(response[2].content).to.equal('');
    expect(response[3].content).to.equal('dependency1 dependency2 dependency2');
  });
});
