import * as Fs from 'fs';

import 'mocha';

import { expect, fail } from '@hapi/code';
import { EvaluationError } from '@hapify/syntax';

import { Generator } from '../src';
import { Model, Template } from '../src/interfaces';

const path = (file: string): string => `${process.cwd()}/test/files/${file}`;
const get = (file: string): string =>
  Fs.readFileSync(path(file), { encoding: 'utf8' });
const ignoreSpaces = (content: string): string => content.replace(/\s+/gm, '');

const models: Model[] = JSON.parse(get('models.json'));
const templates: Template[] = [
  {
    path: 'src/routes/{kebab}/create.js',
    engine: 'hpf',
    input: 'one',
    content: get('templates/model/create.js.hpf'),
  },
  {
    path: 'src/routes/index.js',
    engine: 'hpf',
    input: 'all',
    content: get('templates/index.js.hpf'),
  },
  {
    path: 'src/list.json',
    engine: 'js',
    input: 'all',
    content: get('templates/list.json.js'),
  },
  {
    path: 'src/routes/index-ejs.js',
    engine: 'ejs',
    input: 'all',
    content: get('templates/index-ejs.js.ejs'),
  },
];

describe('generate', () => {
  it('generate files', async () => {
    const response = await Generator.run(templates, models);
    expect(response).to.be.an.array();

    // Test length
    expect(response.length).to.equal(models.length + 3);

    // Test all returned files
    for (const output of response) {
      expect(output.path).to.be.a.string();
      expect(output.content).to.be.a.string();
    }

    // Test index file
    const indexFile = response.find(
      (f: any) => f.path === 'src/routes/index.js',
    );
    expect(indexFile).to.exists();
    expect(ignoreSpaces(indexFile.content)).to.equal(ignoreSpaces(get('output/index.js')));

    // Test user create
    const userFile = response.find(
      (f: any) => f.path === 'src/routes/user/create.js',
    );
    expect(userFile).to.exists();
    expect(ignoreSpaces(userFile.content)).to.equal(ignoreSpaces(get('output/user/create.js')));

    // Test bookmark create
    const bookmarkFile = response.find(
      (f: any) => f.path === 'src/routes/bookmark/create.js',
    );
    expect(bookmarkFile).to.exists();
    expect(ignoreSpaces(bookmarkFile.content)).to.equal(ignoreSpaces(get('output/bookmark/create.js')));

    // Test model list
    const listFile = response.find((f: any) => f.path === 'src/list.json');
    expect(listFile).to.exists();
    expect(ignoreSpaces(listFile.content)).to.equal(ignoreSpaces(get('output/list.json')));
  }).slow(1000);

  it('generate one file for one model', async () => {
    const response = await Generator.run([templates[0]], models, [
      '0cf80d75-abcd-f8c7-41f6-ed41c6425aa1',
    ]);
    expect(response).to.be.an.array();

    // Test length
    expect(response.length).to.equal(1);

    // Test bookmark create
    expect(response[0].path).to.be.a.string();
    expect(response[0].content).to.be.a.string();
    expect(ignoreSpaces(response[0].content)).to.equal(ignoreSpaces(get('output/bookmark/create.js')));
  });

  it('generate files without fields', async () => {
    const response = await Generator.run(
      [
        {
          path: 'src/routes/{kebab}/no-field.js',
          engine: 'hpf',
          input: 'one',
          content: '<<@ F f>><<f a-a>><<@>>END',
        },
      ],
      models.map((m) => ({ ...m, fields: [] })),
      ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1'],
    );
    expect(response).to.be.an.array();

    // Test length
    expect(response.length).to.equal(1);

    // Test bookmark create
    expect(response[0].path).to.be.a.string();
    expect(response[0].content).to.be.a.string();
    expect(response[0].content).to.equal('END');
  });

  it('generate with empty template', async () => {
    const response = await Generator.run(
      [
        {
          path: 'src/routes/{kebab}/create.js',
          engine: 'hpf',
          input: 'one',
          content: '',
        },
      ],
      models,
      ['0cf80d75-abcd-f8c7-41f6-ed41c6425aa1'],
    );
    expect(response).to.be.an.array();

    // Test length
    expect(response.length).to.equal(1);

    // Test bookmark create
    expect(response[0].path).to.be.a.string();
    expect(response[0].content).to.be.a.string();
    expect(response[0].content).to.equal('');
  });

  it('generate with malformed models', async () => {
    await expect(
      Generator.run(
        templates,
        models.map((m) => {
          const clone = { ...m };
          delete clone.accesses;
          return clone;
        }),
      ),
    ).to.reject('Cannot convert undefined or null to object'); // generator.ts:258
  });

  it('generate with broken hpf template', async () => {
    try {
      await Generator.run(
        [{ ...templates[0], content: get('templates/error.js.hpf') }],
        models,
      );
      fail('Should throw an error');
    } catch (error: unknown) {
      const e = error as EvaluationError;
      expect(e.message).to.equal('S is not defined');
      expect(e.code).to.equal(1004);
      expect(e.lineNumber).to.be.a.number();
      expect(e.columnNumber).to.be.a.number();
      expect(e.details).to.contains('File: src/routes/');
    }
  });

  it('generate with broken ejs template', async () => {
    try {
      await Generator.run(
        [{ ...templates[3], content: get('templates/error.js.ejs') }],
        models,
      );
      fail('Should throw an error');
    } catch (error: unknown) {
      const e = error as EvaluationError;
      expect(e.message).to.equal('moodels is not defined');
      expect(e.code).to.equal(7001);
      expect(e.lineNumber).to.be.a.number();
      expect(e.details).to.contains('File: src/routes/');
    }
  });

  it('generate with broken js template', async () => {
    try {
      await Generator.run(
        [{ ...templates[2], content: get('templates/error.js.js') }],
        models,
      );
      fail('Should throw an error');
    } catch (error: unknown) {
      const e = error as EvaluationError;
      expect(e.message).to.equal('unknown is not defined');
      expect(e.code).to.equal(2004);
      expect(e.lineNumber).to.be.a.number();
      expect(e.columnNumber).to.be.a.number();
      expect(e.details).to.contains('File: src/list.json');
    }
  });

  it('generate with timeout hpf template', async () => {
    const error: any = await expect(
      Generator.run(
        [{ ...templates[1], content: '<<< while(true) {} >>>' }],
        models,
      ),
    ).to.reject('Template processing timed out (1000ms)');
    expect(error.code).to.equal(1005);
  }).slow(4000);

  it('generate with timeout js template', async () => {
    const error: any = await expect(
      Generator.run([{ ...templates[2], content: 'while(true) {}' }], models),
    ).to.reject('Template processing timed out (1000ms)');
    expect(error.code).to.equal(2005);
  }).slow(4000);

  it('globals are undefined', async () => {
    await expect(
      Generator.run(
        [
          {
            path: 'src/globals.js',
            engine: 'js',
            input: 'all',
            content: get('templates/globals.js.js'),
          },
        ],
        models,
      ),
    ).to.not.reject();
  });
});
