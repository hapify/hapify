import { expect } from '@hapi/code';
import { readFileSync, readJSONSync } from 'fs-extra';

import 'mocha';
import { HapifySyntax } from '../src';
import { NotesInterpolationPattern } from '../src/patterns/NotesInterpolationPattern';

const Model = readJSONSync(`${__dirname}/models/video.json`);

const Input = readFileSync(
  `${__dirname}/templates/notes-interpolation.hpf`,
  'utf8',
);
const Output = readFileSync(
  `${__dirname}/output/notes-interpolation.txt`,
  'utf8',
);

describe('name interpolation', () => {
  it('run', () => {
    // Test input validity
    expect(Input).to.be.a.string();
    expect(Output).to.be.a.string();
    expect(Model).to.be.an.object();

    expect(HapifySyntax.run(Input, Model)).to.equal(Output);
  });

  it('unit', () => {
    // Names
    expect(NotesInterpolationPattern.execute('<<! Model>>')).to.equal(
      '${root.notes}',
    );
    expect(NotesInterpolationPattern.execute('<<!M >>')).to.equal(
      '${root.notes}',
    );
    expect(NotesInterpolationPattern.execute('<<!PrimaryField>>')).to.equal(
      '${root.fields.primary.notes}',
    );
    expect(NotesInterpolationPattern.execute('<<! P>>')).to.equal(
      '${root.fields.primary.notes}',
    );
    expect(NotesInterpolationPattern.execute('<<!field>>')).to.equal(
      '${field.notes}',
    );
  });
});
