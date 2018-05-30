'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var del = require('delete');
var gm = require('global-modules');
var isValid = require('is-valid-app');
var generate = require('generate');
var pkg = require('../package');
var generator = require('..');
var orig = process.cwd();
var app;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  var filepath = actual(name);
  return function(err) {
    if (err) return cb(err);

    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      assert(stat.isFile());
      del(actual(), cb);
    });
  }
}

describe('verb-readme-generator', function() {
  this.slow(300);

  beforeEach(function() {
    app = generate({cli: true, silent: true});

    app.option('dest', actual());
    app.base.cwd = actual();
    app.option('srcBase', fixtures());
    app.base.option('srcBase', fixtures());

    app.data({runner: pkg});
    app.data(pkg);
    app.data('author.username', 'foo');
  });

  before(function(cb) {
    del(actual(), cb);
  });

  after(function(cb) {
    del(actual(), cb);
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
        assert(foo.tasks.hasOwnProperty('default'));
        count++;
      });

      app.getGenerator('foo');
      cb();
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('generator (CLI)', function() {
      this.timeout(10000);

      it('should run the default task using the `verb-generate-readme` name', function(cb) {
        app.use(generator);
        app.generate('verb-generate-readme', exists('README.md', cb));
      });

      it('should run the default task using the `readme` generator alias', function(cb) {
        app.use(generator);
        app.generate('readme', exists('README.md', cb));
      });
    });
  }

  describe('generator', function() {
    this.timeout(10000);

    it('should work as a generator', function(cb) {
      app.cwd = fixtures();
      app.register('readme', generator);
      app.generate('readme', exists('README.md', cb));
    });

    it('should run the `default` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:default', exists('README.md', cb));
    });

    it.skip('should run the `new` task', function(cb) {
      app.generator('readme', generator);
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

    it.skip('should run the `new` task', function(cb) {
      app.register('readme', generator);
      app.generate('readme:new', exists('.verb.md', cb));
    });
  });

  describe('templates', function() {
    it('should use a custom readme path', function(cb) {
      app.option('readme', fixtures('foo.md'));

      app.register('readme', generator);
      app.generate('readme', function(err) {
        if (err) return cb(err);
        var filepath = actual('README.md');
        var str = fs.readFileSync(filepath, 'utf8');
        assert(/this is <%= name %>/.test(str));
        cb();
      });
    });

    it('should use a custom readme dest', function(cb) {
      app.option('readme', fixtures('foo.md'));
      app.option('dest', actual('foo'));

      app.register('readme', generator);
      app.generate('readme', function(err) {
        if (err) return cb(err);
        var filepath = actual('foo/README.md');
        var str = fs.readFileSync(filepath, 'utf8');
        assert(/this is <%= name %>/.test(str));
        cb();
      });
    });
  });

  describe('variables', function() {
    it('should set `name`', function(cb) {
      app.option('readme', fixtures('variable-name.md'));
      app.data({name: pkg.name});

      app.use(assertVariable(pkg.name));
      app.generate('readme', cb);
    });

    it('should set `alias`', function(cb) {
      app.option('readme', fixtures('variable-alias.md'));
      app.use(assertVariable('foo', {name: 'foo'}));
      app.generate('readme', cb);
    });

    it('should set `varname`', function(cb) {
      app.option('readme', fixtures('variable-varname.md'));
      app.use(assertVariable('verbFooGenerator', {name: 'verb-foo-generator'}));
      app.generate('readme', cb);
    });

    it('should set `license`', function(cb) {
      app.option('readme', fixtures('variable-license.md'));
      app.data({license: 'MIT'});

      app.use(assertVariable('MIT'));
      app.generate('readme', cb);
    });

    it('should set `license-statement`', function(cb) {
      app.option('readme', fixtures('variable-license-statement.md'));
      app.option('layout', null);
      app.data({license: 'MIT'});

      app.use(assertVariable('Released under the MIT License.'));
      app.generate('readme', cb);
    });
  });

  function assertVariable(expected, data) {
    return function() {
      this.onLoad(/\/fixtures/, function(file, next) {
        file.layout = null;
        next();
      });

      this.postRender(/\/fixtures/, function(file, next) {
        assert.equal(file.content.trim(), expected);
        next();
      });

      if (data) {
        this.data(data);
      }
      generator.apply(this, arguments);
    };
  }
});

