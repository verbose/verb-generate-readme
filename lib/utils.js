'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('arr-diff', 'diff');
require('assemble-handle', 'handle');
require('assemble-loader', 'loader');
require('base-fs-conflicts', 'conflicts');
require('base-pkg', 'pkg');
require('base-questions', 'questions');
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
require = fn;

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.filter = function(name) {
  if (path.extname(name) === '') {
    name += '.*';
  }

  var isMatch = utils.matchFile.matcher(name, {flags: 'i'});
  return function(key, file) {
    return (key === name || isMatch(file));
  };
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
