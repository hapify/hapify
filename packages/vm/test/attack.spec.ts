import { expect, fail } from '@hapi/code';
import 'mocha';

import { HapifyVM } from '../src';

describe('possible attacks', () => {
  it('process accesses', () => {
    const script = 'process.exit();';
    expect(() => new HapifyVM().run(script, {})).to.throw(
      'process is not defined',
    );
  });
  it('require accesses 1', () => {
    const script = 'require("http");';
    expect(() => new HapifyVM().run(script, {})).to.throw(
      'require is not defined',
    );
  });
  it('require accesses 2', () => {
    const script =
      'models.constructor.constructor("return process.mainModule.require")()("http")';
    expect(() => new HapifyVM().run(script, { models: {} })).to.throw(
      'Code generation from strings disallowed for this context',
    );
  });
  it('global values', () => {
    const script = 'return JSON.stringify(Object.keys(global));';
    const result = JSON.parse(new HapifyVM().run(script, {}));
    expect(result).to.equal(['VMError', 'Buffer']);
  });
  it('process deep accesses', () => {
    const script =
      'models.constructor.constructor("return { process }")().exit()';
    expect(() => new HapifyVM().run(script, { models: {} })).to.throw(
      'Code generation from strings disallowed for this context',
    );
  });
  it('process deep accesses with this', () => {
    const script =
      'this.constructor.constructor("return { process }")().exit()';
    expect(() => new HapifyVM().run(script, {})).to.throw(
      'Code generation from strings disallowed for this context',
    );
  });

  it('alter console 1', () => {
    const script = 'console = undefined; return "";';
    new HapifyVM().run(script, {});
    expect(console).to.not.be.undefined();
  });
  it('alter console 2', () => {
    const script = 'console.log = function() { return "trojan" }; return "";';
    new HapifyVM().run(script, {});
    // eslint-disable-next-line no-console
    expect(console.log()).to.not.be.a.string();
  });

  it('return fake string', () => {
    const script = 'return { toString: function() { /* Bad function */ } };';
    expect(() => new HapifyVM().run(script, {})).to.throw(
      'Must return a string',
    );
  });

  it('throw evil error 1', () => {
    const script =
      'throw { message: { toString: function() { /* Bad function */ } } };';
    expect(() => new HapifyVM().run(script, {})).to.throw('Invalid error');
  });
  it('throw evil error 2', () => {
    const script =
      'throw { stack: { toString: function() { /* Bad function */ } } };';
    try {
      new HapifyVM().run(script, {});
      fail('Should throw an error');
    } catch (e) {
      expect(e.name).to.equal('VmIntegrityError');
      expect(e.code).to.equal(6004);
      expect(e.message).to.equal('Invalid error');
    }
  });
});
