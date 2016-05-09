'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('log-utils', 'log');
require('base-fs-conflicts', 'conflicts');
require('camel-case', 'camelcase');
require('delete', 'del');
require('fs-exists-sync', 'exists');
require('match-file');
require('get-value', 'get');
require('resolve');
require('time-diff', 'Time');
require = fn;

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
