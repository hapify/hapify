import 'reflect-metadata';
import { expect } from '@hapi/code';

import 'mocha';
import { CLI, Sandbox } from './helpers';

describe('generate command', () => {
  it('success', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();

    // Clone repository first
    const responseNew = await CLI('new', [
      '--dir',
      sandbox.getPath(),
      '--boilerplate',
      'hapijs_tractr',
      '--preset',
      '60caa7bce343b600106315cd', // User
      '--preset',
      '60caa7bce343b600106315ce', // Place
      '--project-name',
      'The Name',
      '--project-desc',
      'The Description',
    ]);

    expect(responseNew.stderr).to.be.empty();
    expect(responseNew.code).to.equal(0);
    expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

    // Generate code
    const response = await CLI('generate', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains([
      'Generated',
      'files',
      'for channel',
      'HapiJS',
    ]);

    expect(sandbox.fileExists(['routes', 'user', 'create.js'])).to.be.true();
    expect(sandbox.fileExists(['routes', 'place', 'delete.js'])).to.be.true();
    expect(sandbox.fileExists(['cmd', 'setup', 'indexes.json'])).to.be.true();
  });

  it('success with two boilerplates', async () => {
    const sandbox = new Sandbox();
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
      '60caa7bce343b600106315cd', // User
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

    // Generate code
    const response = await CLI('generate', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains([
      'Generated',
      'files',
      'for channel',
      'HapiJS',
      'Angular Components',
    ]);

    expect(
      sandbox.fileExists(['boilerplate-hapijs', 'routes', 'user', 'create.js']),
    ).to.be.true();
    expect(
      sandbox.fileExists([
        'boilerplate-ngx-components',
        'src',
        'app',
        'models',
        'user',
        'user.ts',
      ]),
    ).to.be.true();
  });

  it('error during generation', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();

    // Clone repository first
    const responseNew = await CLI('new', [
      '--dir',
      sandbox.getPath(),
      '--boilerplate',
      'hapijs_tractr',
      '--preset',
      '60caa7bce343b600106315cd', // User
      '--preset',
      '60caa7bce343b600106315ce', // Place
      '--project-name',
      'The Name',
      '--project-desc',
      'The Description',
    ]);

    expect(responseNew.stderr).to.be.empty();
    expect(responseNew.code).to.equal(0);
    expect(responseNew.stdout).to.contains('Created 1 new dynamic boilerplate');

    // Introduce an error in file
    const path = ['hapify', 'routes', 'model', 'create.js.hpf'];
    const content = sandbox.getFileContent(path);
    const newContent = `${content}\n\n<<@ S f>>\n...\n<<@>>`;
    sandbox.setFileContent(path, newContent);

    // Generate code
    const response = await CLI('generate', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.contains([
      'SyntaxEvaluationError',
      'S is not defined',
      'Column',
      'Line',
      'File',
    ]);
    expect(response.code).to.equal(1);
    expect(response.stdout).to.be.a.string();
  });
  it('empty templates', async () => {
    const sandbox = new Sandbox();
    sandbox.clear();

    // Clone repository first
    const responseNew = await CLI('new', [
      '--dir',
      sandbox.getPath(),
      '--boilerplate',
      'hapijs_tractr',
      '--preset',
      '60caa7bce343b600106315cd', // User
      '--project-name',
      'The Name',
      '--project-desc',
      'The Description',
    ]);

    expect(responseNew.stderr).to.be.empty();
    expect(responseNew.code).to.equal(0);

    // Empty template
    const path = ['hapify', 'routes', 'model', 'create.js.hpf'];
    sandbox.setFileContent(
      path,
      '\t\n  <<# This is a comment >>  <<< function testFunc () {} >>>  \n',
    );

    // Generate code
    const response = await CLI('generate', ['--dir', sandbox.getPath()]);

    expect(response.stderr).to.be.empty();
    expect(response.code).to.equal(0);
    expect(response.stdout).to.contains([
      'Generated',
      'files',
      'for channel',
      'HapiJS',
    ]);

    expect(sandbox.fileExists(['routes', 'user', 'create.js'])).to.be.false();
    expect(sandbox.fileExists(['routes', 'user', 'delete.js'])).to.be.true();
    expect(sandbox.fileExists(['cmd', 'setup', 'indexes.json'])).to.be.true();
  });
});
