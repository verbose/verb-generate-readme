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
require('fs-exists-sync', 'exists');
require('get-value', 'get');
require('resolve');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
