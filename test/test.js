'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var del = require('delete');
// var verb = require('verb');
var Assemble = require('assemble-core');
var generators = require('base-generators');
var pipeline = require('base-pipeline');
var loader = require('assemble-loader');
var generator = require('..');
var orig = process.cwd();
var app;

function Verb(options) {
  Assemble.call(this, options);
  this.use(generators());
  this.use(pipeline());
  this.use(loader());
}
Assemble.extend(Verb);

function exists(name, cb) {
  var filepath = path.resolve(__dirname, 'actual', name);
  var dir = path.dirname(filepath);
  return function(err) {
    if (err) return cb(err);

    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      // del(dir, {force: true}, cb);
      cb()
    });
  }
}

describe('verb-readme-generator', function() {
  before(function() {
    process.chdir(path.resolve(__dirname, 'fixtures'));
  });

  beforeEach(function() {
    app = new Verb({cli: true, silent: true});
    app.option('dest', path.resolve(__dirname, 'actual'));
    app.data('author.name', 'Jon Schlinkert');
  });

  after(function() {
    process.chdir(orig);
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'verb-readme-generator') {
          count++;
        }
      });
      app.use(generator);
      app.use(generator);
      app.use(generator);
      assert.equal(count, 1);
      cb();
    });
  });

  describe('app plugin', function() {
    it('should work as a plugin', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
    });
  });

  describe('generator plugin', function() {
    it('should work as a generator plugin', function(cb) {
      var count = 0;
      app.register('foo', function(foo) {
        foo.use(generator);
        assert(foo.tasks.hasOwnProperty('default'));
        count++;
      });

      app.getGenerator('foo');
      assert.equal(count, 1);
      cb();
    });

    it('should add tasks to the generator', function(cb) {
      var count = 0;
      app.register('foo', function(foo) {
        foo.use(generator);
        count++;
      });

      app.getGenerator('foo')
        .generate('default', function(err) {
          if (err) return cb(err);
          assert.equal(count, 1);
          cb();
        });
    });
  });

  describe('generator', function() {
    it('should work as a generator', function(cb) {
      app.register('readme', generator);
      app.generate('readme', exists('README.md', cb));
    });

    it('should run the `default` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:default', exists('README.md', cb));
    });

    it('should run the `new` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:new', exists('.verb.md', cb));
    });
  });

  describe('sub-generator', function() {
    it('should work as a plugin', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
    });

    it('should work as a generator', function(cb) {
      app.register('readme', generator);
      app.generate('readme', exists('README.md', cb));
    });

    it('should run the `default` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:default', exists('README.md', cb));
    });

    it('should run the `new` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:new', exists('.verb.md', cb));
    });
  });

  describe('templates', function() {
    it('should use a custom readme path', function(cb) {
      app.option('readme', path.resolve(__dirname, 'fixtures/foo.md'));

      app.register('readme', generator);
      app.generate('readme', function(err) {
        if (err) return cb(err);
        var filepath = path.resolve(__dirname, 'actual/README.md');
        var str = fs.readFileSync(filepath, 'utf8');
        assert(/this is <%= name %>/.test(str));
        cb();
      });
    });

    it('should use a custom readme dest', function(cb) {
      app.option('readme', path.resolve(__dirname, 'fixtures/foo.md'));
      app.option('dest', path.resolve(__dirname, 'actual/foo'));

      app.register('readme', generator);
      app.generate('readme', function(err) {
        if (err) return cb(err);
        var filepath = path.resolve(__dirname, 'actual/foo/README.md');
        var str = fs.readFileSync(filepath, 'utf8');
        assert(/this is <%= name %>/.test(str));
        cb();
      });
    });
  });

  describe('variables', function() {
    it('should set `name`', function(cb) {
      app.option('readme', path.resolve(__dirname, 'fixtures/variable-name.md'));
      app.option('dest', path.resolve(__dirname, 'actual'));
      app.data({name: 'verb-foo-generator'});

      app.register('readme', assertVariable('verb-foo-generator'));
      app.generate('readme', cb);
    });

    it('should set `alias`', function(cb) {
      app.option('readme', path.resolve(__dirname, 'fixtures/variable-alias.md'));
      app.option('dest', path.resolve(__dirname, 'actual'));
      app.data({name: 'verb-foo-generator'});

      app.register('readme', assertVariable('foo'));
      app.generate('readme', cb);
    });

    it('should set `varname`', function(cb) {
      app.option('readme', path.resolve(__dirname, 'fixtures/variable-varname.md'));
      app.option('dest', path.resolve(__dirname, 'actual'));
      app.data({name: 'verb-foo-generator'});

      app.register('readme', assertVariable('verbFooGenerator'));
      app.generate('readme', cb);
    });

    it('should run the `default` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:default', exists('README.md', cb));
    });

    it('should run the `new` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:new', exists('.verb.md', cb));
    });
  });
});

function assertVariable(expected) {
  return function() {
    this.use(generator);
    this.postRender(/./, function(file, next) {
      assert.equal(file.content, expected);
      next();
    });
  }
}
