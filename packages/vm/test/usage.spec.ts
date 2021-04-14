import { expect, fail } from '@hapi/code';
import 'mocha';

import { HapifyVM } from '../src';

describe('usage', () => {
  it('normal', () => {
    expect(
      new HapifyVM().run('return new Date().toString();', {}),
    ).to.be.a.string();
  });
  it('context access', () => {
    expect(new HapifyVM().run('return value', { value: 'TheValue' })).to.equal(
      'TheValue',
    );
    expect(
      new HapifyVM().run('return value.prop', { value: { prop: 'TheValue' } }),
    ).to.equal('TheValue');
  });
  it('no return', () => {
    expect(new HapifyVM().run('return;', {})).to.be.undefined();
  });

  it('return non string', () => {
    try {
      new HapifyVM().run('return 1;', {});
      fail('Should throw an error');
    } catch (e) {
      expect(e.name).to.equal('VmOutputError');
      expect(e.code).to.equal(6001);
      expect(e.message).to.equal('Must return a string');
    }
  });

  it('return non string but allowed', () => {
    expect(new HapifyVM({ allowAnyOutput: true }).run('return 1', {})).to.equal(
      <any>1,
    );
  });

  it('timeout', () => {
    try {
      new HapifyVM({ timeout: 50 }).run('while(true) {}', {});
      fail('Should throw an error');
    } catch (e) {
      expect(e.name).to.equal('VmTimeoutError');
      expect(e.code).to.equal(6003);
      expect(e.message).to.equal('Script execution timed out after 50ms');
    }
  }).slow(200);

  it('evaluation error 1', () => {
    try {
      new HapifyVM({ timeout: 200 }).run('/* comment */ a();', {});
      fail('Should throw an error');
    } catch (e) {
      expect(e.name).to.equal('VmEvaluationError');
      expect(e.code).to.equal(6002);
      expect(e.message).to.equal('a is not defined');
      expect(e.details).to.equal(
        `Error: a is not defined. Line: 1, Column: 15`,
      );
      expect(e.lineNumber).to.equal(1);
      expect(e.columnNumber).to.equal(15);
    }
  });

  it('evaluation error 2', () => {
    try {
      new HapifyVM({ timeout: 200 }).run('function f() { return 3;', {});
      fail('Should throw an error');
    } catch (e) {
      expect(e.name).to.equal('VmEvaluationError');
      expect(e.code).to.equal(6002);
      expect(e.message).to.equal("Unexpected token ')'");
      expect(e.details).to.be.a.string();
      expect(e.lineNumber).to.be.a.number();
      expect(e.columnNumber).to.be.a.number();
    }
  });
});
