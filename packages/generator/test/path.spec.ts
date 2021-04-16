import { expect } from '@hapi/code';

import 'mocha';
import { Generator } from '../src';

describe('path', () => {
  it('convert path with name', () => {
    const response = Generator.path('/this/is/a/{kebab}/test', 'You video');
    expect(response).to.equal('/this/is/a/you-video/test');
  });

  it('convert path without name', () => {
    const response = Generator.path('/this/is/a/test');
    expect(response).to.equal('/this/is/a/test');
  });
});
