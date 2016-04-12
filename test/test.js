'use strict';

require('mocha');
var assert = require('assert');
var readme = require('..');
var Base = require('base');
var app;

describe('verb-readme-generator', function() {
  beforeEach(function() {
    app = new Base();
    app.use(readme());
  });

  it('should export a function', function() {
    assert.equal(typeof readme, 'function');
  });

  it('should export an object', function() {
    assert(readme);
    assert.equal(typeof readme, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      readme();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
