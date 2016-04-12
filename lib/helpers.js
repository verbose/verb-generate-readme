'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var debug = require('debug')('base:verb:verb-readme-generator');
var utils = require('./utils');

module.exports = function plugin(app) {
  if (!this.isApp) return;
  if (this.isRegistered('verb-readme-generator:helpers')) return;

  debug('loading helpers');

  /**
   * async helpers
   */

  app.asyncHelper('related', utils.related(app.options));
  app.asyncHelper('reflinks', utils.reflinks(app.options));
  app.asyncHelper('githubContributors', utils.contributors);
  app.asyncHelper('pkg', function fn(name, prop, cb) {
    if (typeof prop === 'function') {
      cb = prop;
      prop = null;
    }

    var key = name + ':' + String(prop);
    if (fn[key]) {
      cb(null, fn[key]);
      return;
    }

    utils.getPkg(name, function(err, pkg) {
      if (err) return cb(err);
      var res = prop ? utils.get(pkg, prop) : pkg;
      fn[key] = res;
      cb(null, res);
    });
  });

  app.asyncHelper('read', function(fp, cb) {
    fs.read(fp, 'utf8', cb);
  });

  app.asyncHelper('maybeInclude', function(name, helperName, cb) {
    if (typeof helperName === 'function') {
      cb = helperName;
      helperName = 'include';
    }

    var opts = utils.extend({}, this.options, this.context);
    if (opts[name]) {
      var fn = app.getAsyncHelper(helperName);
      return fn.apply(this, arguments);
    } else {
      cb(null, '');
    }
  });

  /**
   * sync helpers
   */

  app.helper('require', function(name) {
    try {
      return require(name);
    } catch (err) {}
    try {
      return require(path.resolve(name));
    } catch (err) {}
  });

  // date helper
  app.helper('date', utils.date);
  app.helper('apidocs', utils.apidocs());
  app.helper('copyright', utils.copyright({linkify: true}));
  app.helper('results', function(val) {
    var fn = require(utils.resolve.sync(app.cwd));
    var lines = util.inspect(fn(val)).split('\n');
    return lines.map(function(line) {
      return '//' + line;
    }).join('\n');
  });

  app.helper('previous', function(increment, v) {
    var segs = String(v).split('.');
    var version = '';
    switch(increment) {
      case 'major':
        version = (segs[0] - 1) + '.0.0';
        break;
      case 'minor':
      default: {
        version = segs[0] + '.' + (segs[1] - 1) + '.0';
        break;
      }
    }
    return version;
  });

  app.helper('issue', function(options) {
    var opts = utils.extend({}, this.context, options);
    opts.owner = opts.owner || opts.author && opts.author.username;
    opts.repo = opts.name;
    return utils.issue(opts);
  });

  app.helper('img_size', function(size, context, options) {
    if (typeof size === 'string') {
      return size;
    }

    options = context || {};
    context = size || {};

    var hash = options.hash;
    if (!hash) {
      hash = context.hash;
      context = this.context;
    }

    // if both `context` and `options` were defined
    var hash = options.hash;
    if (hash && hash.size) {
      return hash.size;
    }

    // either `size` wasn't on `options.hash`, or no context
    // was passed, so handlebars options is actually the
    // second argument
    hash = context.hash;
    if (hash && hash.size) {
      return hash.size;
    }

    // use the front-matter `size`
    return context.size;
  });

  debug('helpers finished');
  return plugin;
};
