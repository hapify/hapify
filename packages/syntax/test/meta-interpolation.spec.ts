import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { MetaInterpolationPattern } from '../src/patterns/MetaInterpolationPattern';

const Model = readJSONSync(`${__dirname}/models/video.json`);

const Input = readFileSync(
  `${__dirname}/templates/meta-interpolation.hpf`,
  'utf8',
);
const InputError = readFileSync(
  `${__dirname}/templates/meta-interpolation-error.hpf`,
  'utf8',
);
const Output = readFileSync(
  `${__dirname}/output/meta-interpolation.txt`,
  'utf8',
);
const OutputError = readFileSync(
  `${__dirname}/output/meta-interpolation-error.txt`,
  'utf8',
);

describe('meta interpolation', () => {
  it('run', () => {
    // Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
  });

  it('error', () => {
    // Test malformed shortcode
    expect(InputError).to.be.a.string();
    expect(OutputError).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(InputError, Model)).to.equal(OutputError);
  });

  it('unit', () => {
    // Names
    expect(MetaInterpolationPattern.execute('<<-M propertyName aA>>')).to.equal(
      '${root.meta.propertyName.camel}',
    );
    expect(
      MetaInterpolationPattern.execute('<<-    M propertyName AA>>'),
    ).to.equal('${root.meta.propertyName.pascal}');
    expect(MetaInterpolationPattern.execute('<<-M propertyName a>>')).to.equal(
      '${root.meta.propertyName.lower}',
    );
    expect(
      MetaInterpolationPattern.execute('<<-  M propertyName A>>'),
    ).to.equal('${root.meta.propertyName.capital}');
    expect(
      MetaInterpolationPattern.execute('<<- M propertyName a-a>>'),
    ).to.equal('${root.meta.propertyName.kebab}');
    expect(
      MetaInterpolationPattern.execute('<<-M propertyName a_a>>'),
    ).to.equal('${root.meta.propertyName.snake}');
    expect(MetaInterpolationPattern.execute('<<-M propertyName aa>>')).to.equal(
      '${root.meta.propertyName.compact}',
    );
    expect(MetaInterpolationPattern.execute('<<-M propertyName R>>')).to.equal(
      '${root.meta.propertyName.raw}',
    );
    // Variable
    expect(
      MetaInterpolationPattern.execute('<<- f property_name2 aA>>'),
    ).to.equal('${f.meta.property_name2.camel}');
    // Spaces
    expect(
      MetaInterpolationPattern.execute('<<-    f      prop  aA>>'),
    ).to.equal('${f.meta.prop.camel}');

    // Primary field
    expect(MetaInterpolationPattern.execute('<<-P prop aA>>')).to.equal(
      '${root.fields.primary.meta.prop.camel}',
    );

    // Sub field
    expect(
      MetaInterpolationPattern.execute('<<-root.fields.primary prop aA>>'),
    ).to.equal('${root.fields.primary.meta.prop.camel}');
  });
});
