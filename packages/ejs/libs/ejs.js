// This is a minimalist version of EJS 3.1.5 without usage of require, cache or filesystem


//==========================================================================
//  utils.js
//==========================================================================
const utils = {};
const regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
utils.escapeRegExpChars = function (string) {
    // istanbul ignore if
    if (!string) {
        return '';
    }
    return String(string).replace(regExpChars, '\\$&');
};

const _ENCODE_HTML_RULES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&#34;',
    "'": '&#39;'
};
const _MATCH_HTML = /[&<>'"]/g;

function encode_char(c) {
    return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

const escapeFuncStr =
    'const _ENCODE_HTML_RULES = {\n'
    + '      "&": "&amp;"\n'
    + '    , "<": "&lt;"\n'
    + '    , ">": "&gt;"\n'
    + '    , \'"\': "&#34;"\n'
    + '    , "\'": "&#39;"\n'
    + '    }\n'
    + '  , _MATCH_HTML = /[&<>\'"]/g;\n'
    + 'function encode_char(c) {\n'
    + '  return _ENCODE_HTML_RULES[c] || c;\n'
    + '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

utils.escapeXML = function (markup) {
    return markup == undefined
        ? ''
        : String(markup)
            .replace(_MATCH_HTML, encode_char);
};
utils.escapeXML.toString = function () {
    return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Extract basename from path
 * @param path
 * @return {*}
 */
utils.basename =function (path) {
    return path.split('/').reverse()[0];
};

/**
 * Extract extension from filename
 * @param filename
 * @return {*}
 */
utils.extname = function(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
};

//==========================================================================
//  ejs.js
//==========================================================================
const ejs = {};
let scopeOptionWarned = false;
/** @type {string} */
const _DEFAULT_OPEN_DELIMITER = '<';
const _DEFAULT_CLOSE_DELIMITER = '>';
const _DEFAULT_DELIMITER = '%';
const _DEFAULT_LOCALS_NAME = 'locals';
const _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements {RethrowCallback}
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} flnm     file name of the EJS file
 * @param {Number} lineno   line number of the error
 * @param {EscapeCallback} esc
 * @static
 */

function rethrow(err, str, flnm, lineno, esc) {
    const lines = str.split('\n');
    const start = Math.max(lineno - 3, 0);
    const end = Math.min(lines.length, lineno + 3);
    const filename = esc(flnm);
    // Error context
    const context = lines.slice(start, end).map(function (line, i){
        const curr = i + start + 1;
        return (curr == lineno ? ' >> ' : '    ')
            + curr
            + '| '
            + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'ejs') + ':'
        + lineno + '\n'
        + context + '\n\n'
        + err.message;

    throw err;
}

function stripSemi(str){
    return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} [opts] compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * Note that the return type of the function also depends on the value of `opts.async`.
 * @public
 */

ejs.compile = function compile(template, opts) {
    let templ;

    // v1 compat
    // 'scope' is 'context'
    // FIXME: Remove this in a future version
    if (opts && opts.scope) {
        if (!scopeOptionWarned){
            console.warn('`scope` option is deprecated and will be removed in EJS 3');
            scopeOptionWarned = true;
        }
        if (!opts.context) {
            opts.context = opts.scope;
        }
        delete opts.scope;
    }
    templ = new Template(template, opts);
    return templ.compile();
};

/**
 * EJS template class
 * @public
 */
ejs.Template = Template;

function Template(text, opts) {
    opts = opts || {};
    const options = {};
    this.templateText = text;
    /** @type {string | null} */
    this.mode = null;
    this.truncate = false;
    this.currentLine = 1;
    this.source = '';
    options.client = opts.client || false;
    options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
    options.compileDebug = opts.compileDebug !== false;
    options.debug = !!opts.debug;
    options.filename = opts.filename;
    options.openDelimiter = opts.openDelimiter || _DEFAULT_OPEN_DELIMITER;
    options.closeDelimiter = opts.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
    options.delimiter = opts.delimiter || _DEFAULT_DELIMITER;
    options.strict = opts.strict || false;
    options.context = opts.context;
    options.rmWhitespace = opts.rmWhitespace;
    options.root = opts.root;
    options.includer = opts.includer;
    options.outputFunctionName = opts.outputFunctionName;
    options.localsName = opts.localsName || _DEFAULT_LOCALS_NAME;
    options.views = opts.views;
    options.async = opts.async;
    options.destructuredLocals = opts.destructuredLocals;
    options.legacyInclude = typeof opts.legacyInclude != 'undefined' ? !!opts.legacyInclude : true;

    if (options.strict) {
        options._with = false;
    }
    else {
        options._with = typeof opts._with != 'undefined' ? opts._with : true;
    }

    this.opts = options;

    this.regex = this.createRegex();
}

Template.modes = {
    EVAL: 'eval',
    ESCAPED: 'escaped',
    RAW: 'raw',
    COMMENT: 'comment',
    LITERAL: 'literal'
};

Template.prototype = {
    createRegex: function () {
        let str = _REGEX_STRING;
        const delim = utils.escapeRegExpChars(this.opts.delimiter);
        const open = utils.escapeRegExpChars(this.opts.openDelimiter);
        const close = utils.escapeRegExpChars(this.opts.closeDelimiter);
        str = str.replace(/%/g, delim)
            .replace(/</g, open)
            .replace(/>/g, close);
        return new RegExp(str);
    },

    compile: function () {
        /** @type {string} */
        let src;
        /** @type {ClientFunction} */
        let fn;
        const opts = this.opts;
        let prepended = '';
        let appended = '';
        /** @type {EscapeCallback} */
        const escapeFn = opts.escapeFunction;
        /** @type {FunctionConstructor} */
        let ctor;

        if (!this.source) {
            this.generateSource();
            prepended +=
                '  let __output = "";\n' +
                '  function __append(s) { if (s !== undefined && s !== null) __output += s }\n';
            if (opts.outputFunctionName) {
                prepended += '  let ' + opts.outputFunctionName + ' = __append;' + '\n';
            }
            if (opts.destructuredLocals && opts.destructuredLocals.length) {
                let destructuring = '  let __locals = (' + opts.localsName + ' || {}),\n';
                for (let i = 0; i < opts.destructuredLocals.length; i++) {
                    const name = opts.destructuredLocals[i];
                    if (i > 0) {
                        destructuring += ',\n  ';
                    }
                    destructuring += name + ' = __locals.' + name;
                }
                prepended += destructuring + ';\n';
            }
            if (opts._with !== false) {
                prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
                appended += '  }' + '\n';
            }
            appended += '  return __output;' + '\n';
            this.source = prepended + this.source + appended;
        }

        if (opts.compileDebug) {
            src = 'let __line = 1' + '\n'
                + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
                + '  , __filename = ' + (opts.filename ?
                    JSON.stringify(opts.filename) : 'undefined') + ';' + '\n'
                + 'try {' + '\n'
                + this.source
                + '} catch (e) {' + '\n'
                + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
                + '}' + '\n';
        }
        else {
            src = this.source;
        }

        if (opts.client) {
            src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
            if (opts.compileDebug) {
                src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
            }
        }

        if (opts.strict) {
            src = '"use strict";\n' + src;
        }
        if (opts.debug) {
            console.log(src);
        }
        if (opts.compileDebug && opts.filename) {
            src = src + '\n'
                + '//# sourceURL=' + opts.filename + '\n';
        }

        try {
            if (opts.async) {
                // Have to use generated function for this, since in envs without support,
                // it breaks in parsing
                try {
                    ctor = (new Function('return (async function(){}).constructor;'))();
                }
                catch(e) {
                    if (e instanceof SyntaxError) {
                        throw new Error('This environment does not support async/await');
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                ctor = Function;
            }
            fn = new ctor(opts.localsName + ', escapeFn, include, rethrow', src);
        }
        catch(e) {
            // istanbul ignore else
            if (e instanceof SyntaxError) {
                if (opts.filename) {
                    e.message += ' in ' + opts.filename;
                }
                e.message += ' while compiling ejs\n\n';
                e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
                e.message += 'https://github.com/RyanZim/EJS-Lint';
                if (!opts.async) {
                    e.message += '\n';
                    e.message += 'Or, if you meant to create an async function, pass `async: true` as an option.';
                }
            }
            throw e;
        }

        // Return a callable function which will execute the function
        // created by the source-code, with the passed data as locals
        // Adds a local `include` function which allows full recursive include
        const returnedFn = opts.client ? fn : function anonymous(data) {
            const include = function (path, includeData) {
                throw new Error('Cannot use include');
            };
            return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
        };
        if (opts.filename && typeof Object.defineProperty === 'function') {
            const filename = opts.filename;
            const basename = utils.basename(filename, utils.extname(filename));
            try {
                Object.defineProperty(returnedFn, 'name', {
                    value: basename,
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
            } catch (e) {/* ignore */}
        }
        return returnedFn;
    },

    generateSource: function () {
        const opts = this.opts;

        if (opts.rmWhitespace) {
            // Have to use two separate replace here as `^` and `$` operators don't
            // work well with `\r` and empty lines don't work well with the `m` flag.
            this.templateText =
                this.templateText.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
        }

        // Slurp spaces and tabs before <%_ and after _%>
        this.templateText =
            this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

        const self = this;
        const matches = this.parseTemplateText();
        const d = this.opts.delimiter;
        const o = this.opts.openDelimiter;
        const c = this.opts.closeDelimiter;

        if (matches && matches.length) {
            matches.forEach(function (line, index) {
                let closing;
                // If this is an opening tag, check for closing tags
                // FIXME: May end up with some false positives here
                // Better to store modes as k/v with openDelimiter + delimiter as key
                // Then this can simply check against the map
                if ( line.indexOf(o + d) === 0        // If it is a tag
                    && line.indexOf(o + d + d) !== 0) { // and is not escaped
                    closing = matches[index + 2];
                    if (!(closing == d + c || closing == '-' + d + c || closing == '_' + d + c)) {
                        throw new Error('Could not find matching close tag for "' + line + '".');
                    }
                }
                self.scanLine(line);
            });
        }

    },

    parseTemplateText: function () {
        let str = this.templateText;
        const pat = this.regex;
        let result = pat.exec(str);
        const arr = [];
        let firstPos;

        while (result) {
            firstPos = result.index;

            if (firstPos !== 0) {
                arr.push(str.substring(0, firstPos));
                str = str.slice(firstPos);
            }

            arr.push(result[0]);
            str = str.slice(result[0].length);
            result = pat.exec(str);
        }

        if (str) {
            arr.push(str);
        }

        return arr;
    },

    _addOutput: function (line) {
        if (this.truncate) {
            // Only replace single leading linebreak in the line after
            // -%> tag -- this is the single, trailing linebreak
            // after the tag that the truncation mode replaces
            // Handle Win / Unix / old Mac linebreaks -- do the \r\n
            // combo first in the regex-or
            line = line.replace(/^(?:\r\n|\r|\n)/, '');
            this.truncate = false;
        }
        if (!line) {
            return line;
        }

        // Preserve literal slashes
        line = line.replace(/\\/g, '\\\\');

        // Convert linebreaks
        line = line.replace(/\n/g, '\\n');
        line = line.replace(/\r/g, '\\r');

        // Escape double-quotes
        // - this will be the delimiter during execution
        line = line.replace(/"/g, '\\"');
        this.source += '    ; __append("' + line + '")' + '\n';
    },

    scanLine: function (line) {
        const self = this;
        const d = this.opts.delimiter;
        const o = this.opts.openDelimiter;
        const c = this.opts.closeDelimiter;
        let newLineCount = 0;

        newLineCount = (line.split('\n').length - 1);

        switch (line) {
            case o + d:
            case o + d + '_':
                this.mode = Template.modes.EVAL;
                break;
            case o + d + '=':
                this.mode = Template.modes.ESCAPED;
                break;
            case o + d + '-':
                this.mode = Template.modes.RAW;
                break;
            case o + d + '#':
                this.mode = Template.modes.COMMENT;
                break;
            case o + d + d:
                this.mode = Template.modes.LITERAL;
                this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + '\n';
                break;
            case d + d + c:
                this.mode = Template.modes.LITERAL;
                this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + '\n';
                break;
            case d + c:
            case '-' + d + c:
            case '_' + d + c:
                if (this.mode == Template.modes.LITERAL) {
                    this._addOutput(line);
                }

                this.mode = null;
                this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
                break;
            default:
                // In script mode, depends on type of tag
                if (this.mode) {
                    // If '//' is found without a line break, add a line break.
                    switch (this.mode) {
                        case Template.modes.EVAL:
                        case Template.modes.ESCAPED:
                        case Template.modes.RAW:
                            if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
                                line += '\n';
                            }
                    }
                    switch (this.mode) {
                        // Just executing code
                        case Template.modes.EVAL:
                            this.source += '    ; ' + line + '\n';
                            break;
                        // Exec, esc, and output
                        case Template.modes.ESCAPED:
                            this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
                            break;
                        // Exec and output
                        case Template.modes.RAW:
                            this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
                            break;
                        case Template.modes.COMMENT:
                            // Do nothing
                            break;
                        // Literal <%% mode, append as raw output
                        case Template.modes.LITERAL:
                            this._addOutput(line);
                            break;
                    }
                }
                // In string mode, just add the output
                else {
                    this._addOutput(line);
                }
        }

        if (self.opts.compileDebug && newLineCount) {
            this.currentLine += newLineCount;
            this.source += '    ; __line = ' + this.currentLine + '\n';
        }
    }
};


