'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('assemble-loader', 'loader');
require('base-fs-conflicts', 'conflicts');
require('base-pkg', 'pkg');
require('base-questions', 'questions');
require('camel-case', 'camelcase');
require('delete', 'del');
require('fs-exists-sync', 'existsSync');
require('get-value', 'get');
require('is-registered');
require('is-valid-instance');
require('log-utils', 'log');
require('match-file');
require = fn;

utils.exists = function(files, cwd) {
  files = utils.arrayify(files);
  var len = files.length;
  var idx = -1;
  while (++idx < len) {
    var file = files[idx];
    if (cwd) file = path.resolve(cwd, file);
    if (utils.existsSync(file)) {
      return true;
    }
  }
  return false;
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Returns true if `app` is a valid "smart plugin" instance.
 *
 * @param {Object} `app`
 * @return {Boolean}
 */

utils.isValid = function(app) {
  if (!utils.isValidInstance(app)) {
    return false;
  }
  if (utils.isRegistered(app, 'verb-readme-generator')) {
    return false;
  }
  return true;
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
