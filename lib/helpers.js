'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const utils = require('./utils');

module.exports = function fn(app) {
  app.helpers(require('template-helpers')());
  const warned = {};

  app.helper('print', function(val) {
    console.log(val);
    return '';
  });

  app.asyncHelper('gif', function(files, options, cb) {
    var args = [].slice.call(arguments);
    cb = args.pop();

    for (var i = 0; i < files.length; i++) {
      var relative = files[i];
      var fp = path.resolve(app.cwd, relative);
      if (fs.existsSync(fp)) {
        var image = `![${this.context.name} example](https://raw.githubusercontent.com/${this.context.repo}/master/${relative})`;
        cb(null, image);
        return;
      }
    }
    cb(null, '');
  });

  app.asyncHelper('when', function(val, str, fallback, cb) {
    if (typeof fallback === 'function') {
      cb = fallback;
      fallback = '';
    }
    cb(null, val === true ? str : fallback);
  });

  app.helper('either', function(a, b) {
    return a || b;
  });

  app.asyncHelper('ghContributors', function(repo, options, cb) {
    if (typeof repo === 'function') {
      cb = repo;
      options = {};
      repo = null;
    }
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    if (typeof repo !== 'string') {
      options = repo;
      repo = null;
    }

    var opt = Object.assign({}, this.options);
    delete opt.lookup;

    options = utils.merge({}, options || opt);
    var format = options.format || 'table';
    options.format = 'noop';

    repo = repo || this.context.repository;
    if (!repo) {
      cb();
      return;
    }

    utils.contributors(repo, options, function(err, people) {
      if (err) return cb(err);
      if (people.length === 0) {
        cb(null);
        return;
      }

      if (people.length === 1 && options.singleContributor !== true) {
        cb(null, '');
      }
      var opts = utils.merge({}, options, {format: format});
      cb(null, utils.formatPeople(people, opts));
    });
  });

  app.asyncHelper('createFile', function(options, cb) {
    const ctx = utils.merge({}, this.context, options);
    const hash = ctx.hash || {};
    hash.basename = hash.basename || hash.name;
    const file = app.helperFile(hash.name, {content: options.fn(ctx) || ''});
    for (const key in hash) {
      if (hash.hasOwnProperty(key)) {
        file[key] = hash[key];
      }
    }
    cb(null, '');
  });

  app.asyncHelper('getPkg', function(...args) {
    return this.app.getAsyncHelper('pkg').call(this, ...args);
  });

  app.helper('gitBranch', function(cwd) {
    return utils.branch.sync(cwd);
  });

  app.helper('enabled', function(prop) {
    return this.app.get('options.' + prop) === true;
  });

  app.helper('disabled', function(prop) {
    return this.app.get('options.' + prop) === false;
  });

  app.helper('is', function(comparison, a, b) {
    return comparison === true ? a : b;
  });

  app.helper('unless', function(comparison, a, b) {
    return comparison === false ? a : b;
  });

  app.helper('toc', function(input, options) {
    if (typeof input !== 'string') {
      options = input;
      input = null;
    }

    var valid = ['append', 'filter', 'slugify', 'bullets', 'maxdepth', 'firsth1', 'stripHeadingTags'];
    var opts = utils.pick(utils.merge({}, this.options, options), valid);
    var str = input || this.view.content;
    if (opts.filter) {
      var isMatch = utils.mm.matcher(opts.filter);
      opts.filter = function(str, tok) {
        return isMatch(tok.slug);
      };
    }

    return utils.toc(str, opts).content;
  });

  app.helper('findFile', function(paths) {
    this.debug(this.helper.name, paths);
    paths = utils.arrayify(paths);
    for (var i = 0; i < paths.length; i++) {
      var fp = path.resolve(this.app.cwd, paths[i]);
      if (fs.existsSync(fp)) {
        return paths[i];
      }
    }
    throw utils.helperError(this, `cannot resolve: ${util.inspect(paths)}`);
  });

  app.helper('list', function(list) {
    return '- ' + list.keys.join('\n- ');
  });

  app.helper('hasValue', function(val, str) {
    return utils.hasValue(val) ? str : '';
  });

  app.helper('hasAny', function(arr, str) {
    arr = utils.arrayify(arr);
    var len = arr.length;
    var idx = -1;
    while (++idx < len) {
      var ele = arr[idx] || [];
      if (ele.length) {
        return str;
      }
    }
    return '';
  });

  app.helper('contentLink', function(repo, filepath) {
    if (typeof filepath === 'undefined') {
      filepath = repo;
      repo = this.context.repo;
    }
    return `https://github.com/${repo}/blob/master/${filepath}`;
  });

  app.helper('docsLink', function(repo, filepath) {
    if (typeof filepath === 'undefined') {
      filepath = repo;
      repo = this.context.repo;
    }
    return `https://github.com/${repo}/blob/master/docs/${filepath}`;
  });

  app.helper('repoLink', function(name) {
    return `https://github.com/${name}`;
  });

  app.helper('increaseHeadings', function(str) {
    return str.replace(/^(#+)/gm, '#$1');
  });

  app.helper('get', function(prop, obj) {
    return utils.get(obj, prop) || '';
  });

  app.helper('config', function(key, prop) {
    var val = app.pkg.get('verb.' + key);
    if (typeof prop === 'undefined') {
      return val;
    }

    if (!val) return prop;
    var str = val[prop];

    if (app[key] && !app[key].getView(str)) {
      return prop;
    }

    if (!str) return prop;
    if (str && str.slice(0, 2) === './') {
      str = path.resolve(app.cwd, str);
    }
    return str;
  });

  app.asyncHelper('includeEither', function(a, b, cb) {
    var view;
    if (typeof a === 'string' && this.context.hasOwnProperty(a)) {
      view = app.includes.getView(a);
      if (typeof view !== 'undefined') {
        view.render(this.context, function(err, res) {
          if (err) return cb(err);
          cb(null, res.content);
        });
        return;
      }
    }

    if (typeof b === 'string' && this.context.hasOwnProperty(b)) {
      view = app.includes.getView(b);
      if (typeof view !== 'undefined') {
        view.render(this.context, function(err, res) {
          if (err) return cb(err);
          cb(null, res.content);
        });
        return;
      }
    }
    app.getAsyncHelper('include').apply(this, arguments);
  });

  /**
   * Deprecations
   */

  app.helper('repo', function(name) {
    if (!warned.repo) {
      warned.repo = true;
      app.log.warn('the `repo` helper was renamed to `repoLink`, please use that helper instead.');
    }
    return `https://github.com/${name}`;
  });

  app.helper('headings', function(str) {
    if (!warned.headings) {
      warned.headings = true;
      app.log.warn('the `headings` helper was renamed to `increaseHeadings`, use that helper instead.');
    }
    return str.replace(/^(#+)/gm, '#$1');
  });
};
