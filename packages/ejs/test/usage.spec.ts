import { expect, fail } from '@hapi/code';
import 'mocha';

import { HapifyEJS } from '../index';

describe('usage', () => {
	it('condition', async () => {
		expect(new HapifyEJS().run('Valid is <% if (valid) { %>TRUE<% } else { %>FALSE<% } %>.', { valid: true })).to.equal('Valid is TRUE.');
	});
	it('context access', async () => {
		expect(new HapifyEJS().run('<%= value %>', { value: 'TheValue' })).to.equal('TheValue');
		expect(new HapifyEJS().run('<%= value.prop %>', { value: { prop: 'TheValue' } })).to.equal('TheValue');
	});
	it('no return', async () => {
		expect(new HapifyEJS().run('<% /* nothing */ %>', {})).to.equal('');
	});

	it('convert number to string', async () => {
		expect(new HapifyEJS().run('<%= 12 %>', {})).to.equal('12');
	});

	it('convert object to string', async () => {
		expect(new HapifyEJS().run('<%- { value: 12 } %>', {})).to.equal('[object Object]');
	});

	it('timeout', async () => {
		try {
			new HapifyEJS({ timeout: 50 }).run('<% while(true) {} %>', {});
			fail('Should throw an error');
		} catch (e) {
			expect(e.name).to.equal('VmTimeoutError');
			expect(e.code).to.equal(6003);
			expect(e.message).to.equal('Script execution timed out after 50ms');
		}
	}).slow(200);

	it('evaluation error 1', async () => {
		try {
			new HapifyEJS({ timeout: 200 }).run('<%= "test" %>\n\n<% /* comment */ a(); %>\n<%= "test" %>', {});
			fail('Should throw an error');
		} catch (e) {
			expect(e.name).to.equal('EjsEvaluationError');
			expect(e.code).to.equal(7001);
			expect(e.message).to.equal('a is not defined');
			expect(e.details).to.contains('>> 3| <% /* comment */ a(); %>');
			expect(e.lineNumber).to.equal(3);
		}
	});

	it('evaluation error 2', async () => {
		try {
			new HapifyEJS({ timeout: 200 }).run('<% function f() { return 3; %>', {});
			fail('Should throw an error');
		} catch (e) {
			expect(e.name).to.equal('VmEvaluationError');
			expect(e.code).to.equal(6002);
			expect(e.message).to.contains('Unexpected token');
			expect(e.details).to.be.a.string();
			expect(e.lineNumber).to.be.a.number();
			expect(e.columnNumber).to.be.a.number();
		}
	});
});

describe('ejs tags', () => {
	const context = { value: 'TheValue' };
	it('scriplet', async () => {
		expect(new HapifyEJS().run('This is <% /* */ %>', context)).to.equal('This is ');
	});
	it('whitespace slurping', async () => {
		expect(new HapifyEJS().run('This is    <%_ _%>   <%= value %> ', context)).to.equal('This isTheValue ');
	});
	it('html escaped', async () => {
		expect(new HapifyEJS().run('This is <%= value %>', context)).to.equal('This is TheValue');
	});
	it('uescaped', async () => {
		expect(new HapifyEJS().run('This is <%- value %>', context)).to.equal('This is TheValue');
	});
	it('comment', async () => {
		expect(new HapifyEJS().run('This is <%# comment %>', context)).to.equal('This is ');
	});
	it('literal opening tag', async () => {
		expect(new HapifyEJS().run('This is <%%', context)).to.equal('This is <%');
	});
	it('trim next line', async () => {
		expect(new HapifyEJS().run('This is <% -%>\n<%- value %>', context)).to.equal('This is TheValue');
	});
});
