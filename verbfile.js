'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend-shallow');
var debug = require('debug')('base:verb:generator');
var middleware = require('common-middleware');
var copyright = require('helper-copyright');
var reflinks = require('helper-reflinks');
var related = require('helper-related');
var apidocs = require('helper-apidocs');
var issue = require('helper-issue');
var date = require('helper-date');
var engine = require('engine-base');
var getPkg = require('get-pkg');
var get = require('get-value');
var toc = require('./toc');

module.exports = function(verb, base) {
  verb.register('toc', toc);
  verb.invoke('toc');

  verb.task('data', function(cb) {
    verb.data({
      runner: {
        name: 'verb',
        url: 'https://github.com/verbose/verb',
        version: '0.9.0'
      }
    });

    verb.data({year: new Date().getFullYear()});
    verb.data(verb.pkg.data);
    verb.data({
      author: {
        name: 'Jon Schlinkert',
        username: 'jonschlinkert',
        twitter: 'jonschlinkert',
        url: 'https://github.com/jonschlinkert'
      }
    });

    // Create a license statement from license in from package.json
    formatLicense(verb);

    debug('data finished');
    cb();
  });

  verb.task('helpers', function(cb) {
    verb.asyncHelper('related', related({verbose: true}));
    verb.asyncHelper('reflinks', reflinks({verbose: true}));
    verb.asyncHelper('pkg', function(name, prop, cb) {
      if (typeof prop === 'function') {
        cb = prop;
        prop = null;
      }
      getPkg(name, function(err, pkg) {
        if (err) return cb(err);
        cb(null, prop ? get(pkg, prop) : pkg);
      });
    });

    verb.helper('apidocs', apidocs());
    verb.helper('date', date);
    verb.helper('copyright', copyright({linkify: true}));
    verb.helper('issue', function(options) {
      var opts = extend({}, this.context, options);
      opts.owner = opts.owner || opts.author && opts.author.username;
      opts.repo = opts.name;
      return issue(opts);
    });

    cb();
  });

  verb.task('create', function(cb) {
    verb.use(middleware());

    verb.create('docs');
    verb.create('badges', {viewType: 'partial', engine: '*' });
    verb.create('includes', {viewType: 'partial', engine: '*' });
    verb.create('layouts', {viewType: 'layout', engine: '*' });
    cb();
  });

  verb.task('templates', ['create', 'helpers', 'data'], function(cb) {
    verb.engine('*', engine, { delims: ['{%', '%}'] });

    debug('adding templates');
    verb.layout('default', {contents: read(verb, 'default.md')});

    debug('adding .verb.md');
    if (fs.existsSync(path.resolve(verb.cwd, '.verb.md'))) {
      verb.doc('readme.md', {contents: read(verb, '.verb.md', verb.cwd)});
    } else {
      verb.doc('readme.md', {contents: read(verb, '.verb.md'), layout: 'default'});
    }

    debug('adding includes');
    verb.includes(require('./templates/includes'));
    verb.badges(require('./templates/badges'));

    debug('templates finished');
    cb();
  });

  verb.task('readme', ['templates'], function(cb) {
    return verb.src('.verb.md', {cwd: verb.cwd})
      .pipe(verb.renderFile('*'))
      .pipe(verb.pipeline(verb.options.pipeline))
      .pipe(verb.dest(function(file) {
        file.basename = 'readme.md';
        return verb.cwd;
      }))
  });

  verb.task('default', ['readme']);
};

function read(app, fp, cwd) {
  cwd = cwd || app.env.templates || path.join(__dirname, 'templates');
  return fs.readFileSync(path.resolve(cwd, fp));
}

/**
 * Add "Released under..." statement to license from
 * package.json.
 *
 * @param {Object} `verb`
 * @return {undefined}
 */

function formatLicense(verb) {
  var license = verb.data('license') || 'MIT';
  var fp = path.resolve(verb.cwd, 'LICENSE');
  if (fs.existsSync(fp)) {
    var url = repoFile(verb.data('repository'), 'LICENSE');
    license = '[' + license + ' license](' + url + ').';
  } else {
    license += ' license.'
  }
  verb.data({license: 'Released under the ' + license});
}

function repoFile(repo, filename) {
  return 'https://github.com/' + repo + '/blob/master/' + filename;
}
