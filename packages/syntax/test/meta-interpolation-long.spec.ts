import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { MetaInterpolationPattern } from '../src/patterns/MetaInterpolationPattern';

const Model = readJSONSync(`${__dirname}/models/video.json`);

const Input = readFileSync(
  `${__dirname}/templates/meta-interpolation-long.hpf`,
  'utf8',
);
const Output = readFileSync(
  `${__dirname}/output/meta-interpolation.txt`,
  'utf8',
);

describe('meta interpolation long', () => {
  it('run', () => {
    // Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
  });

  it('unit', () => {
    // Names
    expect(
      MetaInterpolationPattern.execute('<<-Model propertyName camel>>'),
    ).to.equal('${root.meta.propertyName.camel}');
    expect(
      MetaInterpolationPattern.execute('<<-    Model propertyName pascal>>'),
    ).to.equal('${root.meta.propertyName.pascal}');
    expect(
      MetaInterpolationPattern.execute('<<-Model propertyName lower>>'),
    ).to.equal('${root.meta.propertyName.lower}');
    expect(
      MetaInterpolationPattern.execute('<<-  Model propertyName capital>>'),
    ).to.equal('${root.meta.propertyName.capital}');
    expect(
      MetaInterpolationPattern.execute('<<- Model propertyName kebab>>'),
    ).to.equal('${root.meta.propertyName.kebab}');
    expect(
      MetaInterpolationPattern.execute('<<-Model propertyName snake>>'),
    ).to.equal('${root.meta.propertyName.snake}');
    expect(
      MetaInterpolationPattern.execute('<<-Model propertyName compact>>'),
    ).to.equal('${root.meta.propertyName.compact}');
    expect(
      MetaInterpolationPattern.execute('<<-Model propertyName raw>>'),
    ).to.equal('${root.meta.propertyName.raw}');
    // Variable
    expect(
      MetaInterpolationPattern.execute('<<- f property_name camel>>'),
    ).to.equal('${f.meta.property_name.camel}');
    // Spaces
    expect(
      MetaInterpolationPattern.execute('<<-    f      prop  camel>>'),
    ).to.equal('${f.meta.prop.camel}');

    // Primary field
    expect(MetaInterpolationPattern.execute('<<-P prop camel>>')).to.equal(
      '${root.fields.primary.meta.prop.camel}',
    );

    // Sub field
    expect(
      MetaInterpolationPattern.execute('<<-root.fields.primary prop camel>>'),
    ).to.equal('${root.fields.primary.meta.prop.camel}');
  });
});
