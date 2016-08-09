'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('git-branch', 'branch');
require('arr-diff', 'diff');
require('assemble-handle', 'handle');
require('async-each', 'each');
require('camel-case', 'camelcase');
require('delete', 'del');
require('fs-exists-sync', 'exists');
require('get-value', 'get');
require('gulp-reflinks', 'reflinks');
require('has-value');
require('is-valid-app', 'isValid');
require('log-utils', 'log');
require('markdown-toc', 'toc');
require('match-file');
require('mixin-deep', 'merge');
require('through2', 'through');
require('update-sections', 'update');
require = fn;

utils.createMatcher = function(regex) {
  return function(name) {
    return utils.camelcase(name.replace(regex, ''));
  };
};

utils.helperError = function(app, msg) {
  return new Error(`\`${app.helper.name}\` helper ${msg}, in <${app.view.path}>`);
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.filter = function(name) {
  if (path.extname(name) === '') name += '.*';
  var isMatch = utils.matchFile.matcher(name, {flags: 'i'});
  return function(key, file) {
    return (key === name || isMatch(file));
  };
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
