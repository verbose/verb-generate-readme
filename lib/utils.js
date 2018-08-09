'use strict';

const path = require('path');

/**
 * Lazily require module dependencies in a way that is friendly to
 * both node.js and web/browserify/webpack etc.
 */

define(exports, 'branch', () => require('git-branch'));
define(exports, 'camelcase', () => require('camel-case'));
define(exports, 'contributors', () => require('github-contributors'));
define(exports, 'del', () => require('delete'));
define(exports, 'diff', () => require('arr-diff'));
define(exports, 'each', () => require('async-each'));
define(exports, 'formatPeople', () => require('format-people'));
define(exports, 'get', () => require('get-value'));
define(exports, 'handle', () => require('assemble-handle'));
define(exports, 'hasValue', () => require('has-value'));
define(exports, 'isValid', () => require('is-valid-app'));
define(exports, 'log', () => require('log-utils'));
define(exports, 'matchFile', () => require('match-file'));
define(exports, 'merge', () => require('mixin-deep'));
define(exports, 'mm', () => require('micromatch'));
define(exports, 'pick', () => require('object.pick'));
define(exports, 'reflinks', () => require('gulp-reflinks'));
define(exports, 'toc', () => require('markdown-toc'));
define(exports, 'updateSections', () => require('update-sections'));

function define(obj, key, fn) {
  Reflect.defineProperty(obj, key, { get: fn });
}

exports.createMatcher = function(regex) {
  return function(name) {
    return exports.camelcase(name.replace(regex, ''));
  };
};

exports.helperError = function(app, msg) {
  return new Error(`\`${app.helper.name}\` helper ${msg}, in <${app.view.path}>`);
};

exports.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

exports.filter = function(name) {
  if (path.extname(name) === '') name += '.*';
  var isMatch = exports.matchFile.matcher(name, {flags: 'i'});
  return function(key, file) {
    return (key === name || isMatch(file));
  };
};

