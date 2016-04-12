'use strict';

var fs = require('fs');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('camel-case', 'camelcase');
require('delete', 'del');
require('extend-shallow', 'extend');
require('get-pkg', 'getPkg');
require('get-value', 'get');
require('git-user-name');
require('github-contributors', 'contributors');
require('helper-apidocs', 'apidocs');
require('helper-copyright', 'copyright');
require('helper-date', 'date');
require('helper-issue', 'issue');
require('helper-reflinks', 'reflinks');
require('helper-related', 'related');
require('is-affirmative');
require('kind-of', 'typeOf');
require('omit-empty');
require('parse-author');
require('resolve');
require = fn;

/**
 * Returns true if `fp` exists
 */

utils.exists = function(fp) {
  try {
    fs.statSync(fp);
    return true;
  } catch (err) {}
  return false;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
