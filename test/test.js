'use strict';

require('mocha');
var assert = require('assert');
var Base = require('assemble-core');
var pkg = require('base-pkg');
var readme = require('..');
var app;

describe('verb-readme-generator', function() {
  beforeEach(function() {
    app = new Base();
    app.isApp = true;
    app.use(pkg());
    app.use(readme);
  });

  it('should export a function', function() {
    assert.equal(typeof readme, 'function');
  });
});
