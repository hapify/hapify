import 'reflect-metadata';
import { expect } from '@hapi/code';

import 'mocha';
import { clone as Clone } from '@hapi/hoek';
import { Container } from 'typedi';

import { RichError } from '../src/class/RichError';
import { IConfig } from '../src/interface/Config';
import { IGeneratorResult, IModel } from '../src/interface/Generator';
import { IChannel, IPreset } from '../src/interface/Objects';
import { IStorableCompactProject } from '../src/interface/Storage';
import { Validator } from '../src/interface/Validator';
import {
  WebSocketApplyPresetHandlerInput,
  WebSocketApplyPresetHandlerOutput,
  WebSocketGenerateChannelHandlerInput,
  WebSocketGenerateTemplateHandlerInput,
  WebSocketGetInfoHandlerOutput,
  WebSocketNewModelHandlerInput,
  WebSocketPathPreviewHandlerInput,
  WebSocketTemplatePreviewHandlerInput,
  WebSocketValidateModelHandlerInput,
} from '../src/interface/WebSocketHandlers';
import { HttpServerService } from '../src/service/HttpServer';
import { CLI, Fetch, Sandbox, SingleUseWebSocketClient } from './helpers';

let authJson: { url: string };
let sandbox: Sandbox;

describe('serve command', () => {
  before('start server with two boilerplates', async () => {
    sandbox = new Sandbox();
    sandbox.clear();

    // Clone repository first
    const responseNew = await CLI('new', [
      '--dir',
      sandbox.getPath(),
      '--boilerplate-url',
      'https://github.com/Tractr/boilerplate-hapijs.git',
      '--boilerplate-url',
      'https://github.com/Tractr/boilerplate-ngx-components.git',
      '--preset',
      '60104aabe0fe50001033f10e', // User
      '--project-name',
      'The Name',
      '--project-desc',
      'The Description',
    ]);

    expect(responseNew.stderr).to.be.empty();
    expect(responseNew.code).to.equal(0);
    expect(responseNew.stdout).to.contains(
      'Created 2 new dynamic boilerplates',
    );

    // Start server
    const response = await CLI('serve', [
      '--dir',
      sandbox.getPath(),
      '--no-open',
    ]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains(['Server is running at', 'localhost']);

    // Get JSON auth
    const host = /http:\/\/localhost:(\d+)/.exec(response.stdout);
    expect(host).to.not.be.empty();
    const rootUrl = host[0];
    const port = Number(host[1]);
    const authJsonUrl = `${rootUrl}/ws.json`;
    authJson = await Fetch<{ url: string }>(authJsonUrl);

    expect(authJson.url).to.contains(['ws://localhost', 'token=']);
  });

  // =======================================================================================
  //	ERRORS
  // =======================================================================================
  it('wrong message', async () => {
    await expect(
      SingleUseWebSocketClient(authJson.url, {
        id: 'get:wrong' as any,
        data: {},
      }),
    ).to.reject(/"id" must be one of/);
  });

  it('no token', async () => {
    await expect(
      SingleUseWebSocketClient(authJson.url.split('token=')[0], {
        id: 'get:info',
        data: {},
      }),
    ).to.reject('Unexpected server response: 401');
  });

  it('wrong token', async () => {
    await expect(
      SingleUseWebSocketClient(`${authJson.url}abcdef`, {
        id: 'get:info',
        data: {},
      }),
    ).to.reject('Unexpected server response: 401');
  });

  it('template preview error', async () => {
    const channels = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    const models = await SingleUseWebSocketClient<{}, IModel[]>(authJson.url, {
      id: 'get:models',
      data: {},
    });

    const template = channels[0].templates.find((t) => t.input === 'one');
    template.content = `${template.content}\n\n<<@ S f>>\n...\n<<@>>`;
    // With one model
    const response = await SingleUseWebSocketClient<
      WebSocketTemplatePreviewHandlerInput,
      RichError
    >(authJson.url, {
      id: 'prv:template',
      data: {
        model: models[0].id,
        channel: channels[0].id,
        template,
      },
    });
    expect(response.message).to.equal('S is not defined');
    expect(response.data).to.be.an.object();
    expect(response.data.code).to.be.a.number();
    expect(response.data.type).to.equal('SyntaxEvaluationError');
    expect(response.data.columnNumber).to.be.a.number();
    expect(response.data.lineNumber).to.be.a.number();
    expect(response.data.details).to.be.a.string();
  });

  // =======================================================================================
  //	GETTERS
  // =======================================================================================
  it('get info', async () => {
    const response = await SingleUseWebSocketClient<
      {},
      WebSocketGetInfoHandlerOutput
    >(authJson.url, { id: 'get:info', data: {} });
    expect(response.limits).to.be.an.object();
    expect(response.limits.templates).to.be.a.number();
    expect(response.limits.fields).to.be.a.number();
    expect(response.limits.models).to.be.a.number();
    expect(response.limits.projects).to.be.a.number();

    expect(response.project).to.be.an.object();
    expect(response.project.name).to.equal('The Name');
    expect(response.project.description).to.equal('The Description');
  });

  it('get models', async () => {
    const response = await SingleUseWebSocketClient<{}, IModel[]>(
      authJson.url,
      { id: 'get:models', data: {} },
    );
    expect(response).to.be.an.array();
    expect(response.length).to.equal(1);
    expect(response[0].name).to.equal('User');
    expect(response[0].fields).to.be.an.array();
  });

  it('get presets', async () => {
    const response = await SingleUseWebSocketClient<{}, IPreset[]>(
      authJson.url,
      { id: 'get:presets', data: {} },
    );
    expect(response).to.be.an.array();
    expect(response.length).to.least(1);
    expect(response[0].name).to.be.a.string();
  });

  it('get channels', async () => {
    const response = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    expect(response).to.be.an.array();
    expect(response.length).to.least(1);
    expect(response[0].name).to.be.a.string();
    expect(response[0].templates).to.be.an.array();
    expect(response[0].templates.length).to.least(1);
    expect(response[0].templates[0].path).to.be.a.string();
  });

  it('path preview', async () => {
    const models = await SingleUseWebSocketClient<{}, IModel[]>(authJson.url, {
      id: 'get:models',
      data: {},
    });

    const response = await SingleUseWebSocketClient<
      WebSocketPathPreviewHandlerInput,
      string
    >(authJson.url, {
      id: 'prv:path',
      data: {
        model: models[0].id,
        path: 'path/to/{kebab}/{constant}/{pascal}.ts',
      },
    });
    expect(response).to.equal('path/to/user/USER/User.ts');

    const response2 = await SingleUseWebSocketClient<
      WebSocketPathPreviewHandlerInput,
      string
    >(authJson.url, {
      id: 'prv:path',
      data: {
        path: 'path/to/file.ts',
      },
    });
    expect(response2).to.equal('path/to/file.ts');
  });

  it('template preview', async () => {
    const channels = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    const models = await SingleUseWebSocketClient<{}, IModel[]>(authJson.url, {
      id: 'get:models',
      data: {},
    });

    // With one model
    const response = await SingleUseWebSocketClient<
      WebSocketTemplatePreviewHandlerInput,
      IGeneratorResult
    >(authJson.url, {
      id: 'prv:template',
      data: {
        model: models[0].id,
        channel: channels[0].id,
        template: channels[0].templates.find((t) => t.input === 'one'),
      },
    });
    expect(response).to.be.an.object();
    expect(response.path).to.be.a.string();
    expect(response.path).to.be.not.empty();
    expect(response.content).to.be.a.string();
    expect(response.content).to.be.not.empty();

    // With all models
    const response2 = await SingleUseWebSocketClient<
      WebSocketTemplatePreviewHandlerInput,
      IGeneratorResult
    >(authJson.url, {
      id: 'prv:template',
      data: {
        channel: channels[0].id,
        template: channels[0].templates.find((t) => t.input === 'all'),
      },
    });
    expect(response2).to.be.an.object();
    expect(response2.path).to.be.a.string();
    expect(response2.path).to.be.not.empty();
    expect(response2.content).to.be.a.string();
    expect(response2.content).to.be.not.empty();
  });

  it('validate model', async () => {
    const channels = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    const models = await SingleUseWebSocketClient<{}, IModel[]>(authJson.url, {
      id: 'get:models',
      data: {},
    });

    // Working validation
    const response = await SingleUseWebSocketClient<
      WebSocketValidateModelHandlerInput,
      Validator
    >(authJson.url, {
      id: 'val:model',
      data: {
        model: models[0],
        content: channels[0].validator,
      },
    });
    expect(response).to.equal({
      warnings: [],
      errors: [],
    });

    // With error (remove primary field)
    models[0].fields = models[0].fields.filter((f) => !f.primary);
    const response2 = await SingleUseWebSocketClient<
      WebSocketValidateModelHandlerInput,
      Validator
    >(authJson.url, {
      id: 'val:model',
      data: {
        model: models[0],
        content: channels[0].validator,
      },
    });
    expect(response2).to.equal({
      warnings: [],
      errors: [
        'Primary key is required',
        'Model with owner access must have a ownership field',
      ],
    });
  });

  // =======================================================================================
  //	SETTERS
  // =======================================================================================
  it('apply preset', async () => {
    const presets = await SingleUseWebSocketClient<{}, IPreset[]>(
      authJson.url,
      { id: 'get:presets', data: {} },
    );
    const preset = presets.find((p) => p.name === 'Listing');
    const response = await SingleUseWebSocketClient<
      WebSocketApplyPresetHandlerInput,
      WebSocketApplyPresetHandlerOutput
    >(authJson.url, {
      id: 'apply:presets',
      data: {
        models: preset.models,
      },
    });
    expect(response).to.be.an.object();
    expect(response.created).to.be.an.array();
    expect(response.created.length).to.equal(4);
    expect(response.updated).to.be.an.array();
    expect(response.updated.length).to.equal(0);
  });

  it('generate template', async () => {
    const channels = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    const response = await SingleUseWebSocketClient<
      WebSocketGenerateTemplateHandlerInput,
      void
    >(authJson.url, {
      id: 'gen:template',
      data: {
        channel: channels[0].id,
        template: 'routes/{kebab}/read.js',
      },
    });
    expect(typeof response).to.equal('undefined');

    // Check if the file has been generated
    expect(
      sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'read.js']),
    ).to.be.true();
  });

  it('generate channel', async () => {
    const channels = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    const response = await SingleUseWebSocketClient<
      WebSocketGenerateChannelHandlerInput,
      void
    >(authJson.url, {
      id: 'gen:channel',
      data: {
        channel: channels[0].id,
      },
    });
    expect(typeof response).to.equal('undefined');

    // Check if the file has been generated
    expect(
      sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'create.js']),
    ).to.be.true();
    expect(
      sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'update.js']),
    ).to.be.true();
    expect(
      sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'delete.js']),
    ).to.be.true();
    expect(
      sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'inc.js']),
    ).to.be.true();
  });

  it('new model', async () => {
    const response = await SingleUseWebSocketClient<
      WebSocketNewModelHandlerInput,
      IModel
    >(authJson.url, {
      id: 'new:model',
      data: {
        name: 'Profile',
      },
    });
    expect(response).to.be.an.object();
    expect(response.name).to.equal('Profile');
    expect(response.id).to.be.a.string();
    expect(response.fields).to.be.an.array();
    expect(response.fields.length).to.equal(2);
    expect(response.fields.map((f) => f.name)).to.contains([
      '_id',
      'created at',
    ]); // Default fields
  });

  it('set channels', async () => {
    const channels = await SingleUseWebSocketClient<{}, IChannel[]>(
      authJson.url,
      { id: 'get:channels', data: {} },
    );
    const newChannel = channels[0];
    newChannel.templates = newChannel.templates.slice(0, 5);
    newChannel.templates[4].path = 'routes/{kebab}/new.js';

    const response = await SingleUseWebSocketClient<IChannel[], void>(
      authJson.url,
      {
        id: 'set:channels',
        data: [newChannel],
      },
    );
    expect(typeof response).to.equal('undefined');

    expect(
      sandbox.fileExists([
        'boilerplate-hapijs',
        'hapify',
        'routes',
        '__kebab__',
        'create.js.hpf',
      ]),
    ).to.be.true();
    expect(
      sandbox.fileExists([
        'boilerplate-hapijs',
        'hapify',
        'routes',
        '__kebab__',
        'new.js.hpf',
      ]),
    ).to.be.true();
    expect(
      sandbox.fileExists([
        'boilerplate-hapijs',
        'hapify',
        'routes',
        '__kebab__',
        'delete.js.hpf',
      ]),
    ).to.be.false();
    expect(
      sandbox.fileExists([
        'boilerplate-hapijs',
        'hapify',
        'routes',
        '__kebab__',
        'read.js.hpf',
      ]),
    ).to.be.false();

    const hapifyJSON = sandbox.getJSONFileContent<IConfig>([
      'boilerplate-hapijs',
      'hapify.json',
    ]);
    expect(hapifyJSON.templates.length).to.equal(5);
  });

  it('set models', async () => {
    const models = await SingleUseWebSocketClient<{}, IModel[]>(authJson.url, {
      id: 'get:models',
      data: {},
    });
    const newModel = Clone(models[0]);
    newModel.name = 'New Model';
    newModel.fields = [];

    const response = await SingleUseWebSocketClient<IModel[], void>(
      authJson.url,
      {
        id: 'set:models',
        data: [models[0], newModel],
      },
    );
    expect(typeof response).to.equal('undefined');

    const hapifyModelsJSON = sandbox.getJSONFileContent<IStorableCompactProject>(
      ['boilerplate-hapijs', 'hapify-models.json'],
    );

    // Check that model has been written
    expect(hapifyModelsJSON.models.length).to.equal(2);
    expect(hapifyModelsJSON.models[0].name).to.equal('User');
    expect(hapifyModelsJSON.models[1].name).to.equal('New Model');
    expect(hapifyModelsJSON.models[1].fields.length).to.equal(0);

    // Check from endpoint
    const response2 = await SingleUseWebSocketClient<{}, IModel[]>(
      authJson.url,
      { id: 'get:models', data: {} },
    );
    expect(response2).to.be.an.array();
    expect(response2.length).to.equal(2);
    expect(response2.map((m) => m.name)).to.contains(['User', 'New Model']);
  });

  after('shutdown server', async () => {
    // Stop server
    const http = Container.get(HttpServerService);
    await http.stop();
  });
});
