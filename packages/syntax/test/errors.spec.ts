import { expect, fail } from '@hapi/code';
import { OutputError } from '@hapify/vm';
import { readFileSync, readJSONSync } from 'fs-extra';
import 'mocha';

import { ArgumentsError, EvaluationError, HapifySyntax, TimeoutError } from '../src';

const Model = readJSONSync('./models/video.json');

const Simple = readFileSync(`${__dirname}/templates/simple.hpf`, 'utf8');
const InputConditional = readFileSync(`${__dirname}/templates/error-conditional.hpf`, 'utf8');
const InputIteration = readFileSync(`${__dirname}/templates/error-iteration.hpf`, 'utf8');
const InputInterpolation = readFileSync(`${__dirname}/templates/error-interpolation.hpf`, 'utf8');
const InputTimeout = readFileSync(`${__dirname}/templates/error-timeout.hpf`, 'utf8');
const InputRequire = readFileSync(`${__dirname}/templates/error-require.hpf`, 'utf8');
const InputImport = readFileSync(`${__dirname}/templates/error-import.hpf`, 'utf8');
const InputGlobal = readFileSync(`${__dirname}/templates/error-global.hpf`, 'utf8');
const InputReturn = readFileSync(`${__dirname}/templates/error-return.hpf`, 'utf8');

describe('errors', () => {
	it('run', () => {
		// Test input validity
		expect(Simple).to.be.a.string();
		expect(Model).to.be.an.object();

		expect(() => (<any>HapifySyntax.run)()).to.throw(ArgumentsError);

		expect(() => (<any>HapifySyntax.run)(Simple)).to.throw(ArgumentsError);

		expect(() => (<any>HapifySyntax.run)(Simple)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(Simple, null)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(Simple, true)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(Simple, 3)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(Simple, 'string')).to.throw(ArgumentsError);

		expect(() => (<any>HapifySyntax.run)(undefined, Model)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(null, Model)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(false, Model)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)(4, Model)).to.throw(ArgumentsError);
		expect(() => (<any>HapifySyntax.run)({}, Model)).to.throw(ArgumentsError);

		expect(HapifySyntax.run(Simple, Model)).to.be.a.string();
	});

	it('Check reverse lineColumn error for conditional', () => {
		// Test input validity
		expect(InputConditional).to.be.a.string();
		expect(Model).to.be.an.object();

		try {
			HapifySyntax.run(InputConditional, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(EvaluationError, 'rrgrfbfb is not defined');
			expect(err.code).to.be.a.number();
			expect(err.lineNumber).to.be.a.number();
			expect(err.columnNumber).to.be.a.number();
			expect(err.details).to.be.equal('Error: rrgrfbfb is not defined. Line: 16, Column: 13');
		}
	});

	it('Check reverse lineColumn error for iteration', () => {
		// Test input validity
		expect(InputIteration).to.be.a.string();
		expect(Model).to.be.an.object();

		try {
			HapifySyntax.run(InputIteration, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(EvaluationError, 'T is not defined');
			expect(err.code).to.be.a.number();
			expect(err.lineNumber).to.be.a.number();
			expect(err.columnNumber).to.be.a.number();
			expect(err.details).to.be.equal('Error: T is not defined. Line: 10, Column: 1');
		}
	});

	it('Check reverse lineColumn error for name interpolation', () => {
		// Test input validity
		expect(InputInterpolation).to.be.a.string();
		expect(Model).to.be.an.object();

		try {
			HapifySyntax.run(InputInterpolation, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(EvaluationError, 'g is not defined');
			expect(err.code).to.be.a.number();
			expect(err.lineNumber).to.be.a.number();
			expect(err.columnNumber).to.be.a.number();
			expect(err.details).to.be.equal('Error: g is not defined. Line: 20, Column: 5');
		}
	});

	it('Do not returns string', () => {
		// Test input validity
		expect(InputReturn).to.be.a.string();
		expect(Model).to.be.an.object();

		try {
			HapifySyntax.run(InputReturn, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(OutputError, 'Must return a string');
		}
	});

	it('Trigger a timeout', () => {
		// Test input validity
		expect(InputTimeout).to.be.a.string();
		expect(Model).to.be.an.object();

		const start1 = Date.now();
		try {
			HapifySyntax.run(InputTimeout, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(TimeoutError);
			expect(err.code).to.be.a.number();
			expect(Date.now() - start1).to.be.within(1000, 1020);
		}

		const start2 = Date.now();
		try {
			HapifySyntax.run(InputTimeout, Model, { timeout: 300 });
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(TimeoutError);
			expect(err.code).to.be.a.number();
			expect(Date.now() - start2).to.be.within(300, 320);
		}
	}).slow(4000);

	it('Cannot use require', () => {
		// Test input validity
		expect(InputRequire).to.be.a.string();
		expect(Model).to.be.an.object();

		try {
			HapifySyntax.run(InputRequire, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(EvaluationError, 'require is not defined');
			expect(err.code).to.be.a.number();
			expect(err.lineNumber).to.be.a.number();
			expect(err.columnNumber).to.be.a.number();
			expect(err.details).to.be.equal('Error: require is not defined. Line: 5, Column: 1');
		}
	});

	it('Cannot use import', () => {
		// Test input validity
		expect(InputImport).to.be.a.string();
		expect(Model).to.be.an.object();

		try {
			HapifySyntax.run(InputImport, Model);
			fail('This input needs to return an error');
		} catch (err) {
			expect(err).to.be.an.error(EvaluationError, 'Cannot use import statement outside a module');
			expect(err.details).to.be.equal('Error: Cannot use import statement outside a module. Line: null, Column: null');
		}
	});

	it('Cannot use global objects', () => {
		// Test input validity
		expect(InputGlobal).to.be.a.string();
		expect(Model).to.be.an.object();
		expect(HapifySyntax.run(InputGlobal, Model)).to.be.a.string();
	});
});
