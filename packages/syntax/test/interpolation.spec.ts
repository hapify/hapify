import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { InterpolationPattern } from '../src/patterns/InterpolationPattern';

const Model = readJSONSync(`${__dirname}/models/video.json`);

const Input = readFileSync(`${__dirname}/templates/interpolation.hpf`, {
  encoding: 'utf8',
});
const Output = readFileSync(`${__dirname}/output/interpolation.txt`, {
  encoding: 'utf8',
});

describe('interpolation', () => {
  it('run', () => {
    // Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
  });

  it('unit', () => {
    // Names
    expect(InterpolationPattern.execute('<<=test.custom.prop>>')).to.equal(
      '`;\nout += test.custom.prop;\nout += `',
    );
    expect(
      InterpolationPattern.execute('<<=test.custom.prop.join(`${f.name}`) >>'),
    ).to.equal('`;\nout += test.custom.prop.join(`${f.name}`) ;\nout += `');
  });
});
