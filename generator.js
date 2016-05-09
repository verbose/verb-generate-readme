'use strict';

var fs = require('fs');
var path = require('path');
var cwd = path.resolve.bind(path, __dirname);
var debug = require('debug')('base:verb:verb-readme-generator');
var helpers = require('./lib/helpers');
var utils = require('./lib/utils');
var lint = require('./lib/lint');

/**
 * Verb readme generator
 */

module.exports = function generator(app, base) {
  if (!isValidInstance(app)) return;
  debug('initializing <%s>, called from <%s>', __filename, module.parent.id);

  if (typeof app.pkg === 'undefined') {
    throw new Error('expected the base-pkg plugin to be registered');
  }

  /**
   * Begin timings (`verb --times`)
   */


  var time = new utils.Time();
  if (!app.enabled('times')) {
    app.disable('logDiff');
  }

  var diff = time.diff('verb-readme-generator', app.options);
  diff('start', app.options);

  /**
   * Set options
   */

  app.option('toc.footer', '\n\n_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_');
  app.option('engineOpts', {delims: ['{%', '%}']});
  app.option('viewEngine', '*');
  app.option('toAlias', function readme(name) {
    if (/^verb-.*?-\w/.test(name)) {
      return name.replace(/^verb-(.*?)-(?:\w+)/, '$1');
    }
    return name.slice(name.lastIndexOf('-') + 1);
  });
  diff('options');

  function dir(name) {
    return app.option(name) || cwd(name);
  }

  /**
   * Plugins
   */

  app.use(utils.conflicts());
  app.use(require('verb-defaults'));
  app.use(require('verb-collections'));
  app.use(require('verb-repo-helpers'));
  app.use(require('verb-repo-data'));
  app.use(require('verb-toc'));
  diff('plugins');

  /**
   * Helpers
   */

  helpers(app);

  /**
   * Middleware
   */

  app.task('middleware', { silent: true }, function(cb) {
    if (app.option('lint.reflinks')) {
      app.postRender(/\.md$/, require('./lib/reflinks')(app));
    }

    if (app.option('sections')) {
      app.onLoad(/\.md$/, require('./lib/sections')(app));
    }

    app.preRender(/(verb|readme)\.md$/i, function(file, next) {
      utils.del(path.resolve(app.cwd, 'readme.md'), next);
    });

    app.onLoad(/(verb|readme)\.md$/, lint.layout(app));
    app.on('readme-generator:end', function() {
      var warnings = app.get('cache.readmeWarnings');
      warnings.forEach(function(obj) {
        console.log(obj.filename + ' | ' + obj.message);
      });
    });

    diff('middleware');
    cb();
  });

  /**
   * Loads data to used for rendering templates. Called by the [readme]() task.
   *
   * ```sh
   * $ verb readme:data
   * ```
   * @name data
   * @api public
   */

  app.task('data', { silent: true }, function(cb) {
    debug('loading data');

    if (utils.exists(path.join(app.cwd, 'bower.json'))) {
      app.data({bower: true});
    }

    if (app.isGenerator) {
      app.option('toAlias', function(name) {
        return utils.camelcase(name.replace(/^generate-/, ''));
      });
    }

    app.data({prefix: 'Copyright'});
    debug('data finished');
    diff('data');
    cb();
  });

  /**
   * Add a `.verb.md` template to the current working directory.
   *
   * ```sh
   * $ verb readme:new
   * ```
   * @name new
   * @api public
   */

  app.task('new', function() {
    var dest = path.resolve(app.option('dest') || app.cwd);
    var file = app.file('.verb.md', readTemplate(app, 'verbmd/basic.md'));
    return app.toStream('files')
      .pipe(app.conflicts(dest))
      .pipe(app.dest(function(file) {
        file.base = dest;
        file.path = path.resolve(file.base, '.verb.md');
        return dest;
      }))
  });

  /**
   * Load the `.verb.md` in the user's current working directory. If no `.verb.md`
   * file exists, the [prompt-verbmd)() task is called to ask the user if they want to
   * add the file. Disable the prompt by passing `--verbmd=false` on the command line,
   * or `app.disable('verbmd')` via API.
   *
   * ```sh
   * $ verb readme:verbmd
   * ```
   * @name verbmd
   * @api public
   */

  app.task('verbmd', { silent: true }, function(cb) {
    debug('loading .verb.md');

    if (app.views.files['README'] || app.views.files['.verb'] || app.options.verbmd === false) {
      cb();
      return;
    }

    // try to load ".verb.md" or custom file from user cwd
    var readme = path.resolve(app.cwd, app.option('readme') || '.verb.md');
    if (utils.exists(readme)) {
      app.file('README.md', readTemplate(app, readme, app.cwd));
      cb();
      return;
    }

    app.build('ask', cb);
  });

  /**
   * Prompts the user to add a new `.verb.md` template to the current working directory.
   * Useful in sub-generators.
   *
   * ```sh
   * $ verb readme:prompt-verbmd
   * ```
   * @name prompt-verbmd
   * @api public
   */

  app.task('prompt-verbmd', function(cb) {
    // if no .verb.md exists, offer to add one
    app.confirm('verbmd', 'Can\'t find a .verb.md, want to add one?');
    app.ask('verbmd', { save: false }, function(err, answers) {
      if (err) return cb(err);
      if (answers.verbmd) {
        app.build('new', cb);
      } else {
        cb();
      }
    });
  });

  /**
   * User-friendly alias for the [prompt-verbmd]() task. _(This task is aliased with both a
   * terse and long-form name so that in the case this generator is inherited by another
   * and the generator already has an `ask` task, the `prompt-verbmd` task will still be
   * available to use via API.)_
   *
   * ```sh
   * $ verb readme:ask
   * ```
   * @name ask
   * @api public
   */

  app.task('ask', ['prompt-verbmd']);

  /**
   * Load layouts, includes and badges commonly used for generating a README.md.
   *
   * ```sh
   * $ verb readme:templates
   * ```
   * @name templates
   * @api public
   */

  app.task('templates', { silent: true }, function(cb) {
    debug('loading templates');

    app.option('renameKey', function(key, file) {
      return file ? file.basename : path.basename(key);
    });

    // load `docs` templates in user cwd
    app.docs('*.md', {cwd: path.resolve(app.cwd, 'docs')});

    // load `layout` templates
    app.layouts('templates/layouts/*.md', { cwd: __dirname });

    // load `include` templates
    app.includes('templates/includes/**/*.md', { cwd: __dirname });
    app.includes(require('./templates/includes'));

    // load `badges` templates
    app.badges(require('./templates/badges'));

    // done
    debug('templates finished');
    diff('templates');
    cb();
  });

  /**
   * Generate a README.md from a `.verb.md` template. Runs the [middleware](), [templates](),
   * and [data]() tasks. This is a [verb](){/docs/tasks/#silent} task.
   *
   * ```sh
   * $ verb readme
   * ```
   * @name readme
   * @api public
   */

  app.task('readme', {silent: true}, ['middleware', 'templates', 'verbmd', 'data'], function(cb) {
    debug('starting readme task');
    var readme = path.resolve(app.cwd, app.option('readme') || '.verb.md');
    var dest = path.resolve(app.option('dest') || app.cwd);

    app.toStream('files', utils.filter(readme)).on('error', cb)
      .pipe(app.renderFile('*', app.cache.data)).on('error', cb)
      .pipe(app.pipeline(app.options.pipeline)).on('error', cb)
      .pipe(app.dest(function(file) {
        file.basename = 'README.md';
        return dest;
      }))
      .on('error', cb)
      .on('end', function() {
        diff('readme');
        cb();
      })
  });

  /**
   * Alias for the [readme]() task, generates a README.md to the user's working directory.
   *
   * ```sh
   * $ verb readme
   * ```
   * @name default
   * @api public
   */

  app.task('default', ['readme'], function(cb) {
    this.on('finished', app.emit.bind(app, 'readme-generator:end'));
    cb();
  });

  return generator;
};

/**
 * Read a template
 *
 * @param {Object} `verb`
 * @param {String} `fp`
 * @param {String} `base`
 * @return {String}
 */

function readTemplate(app, filepath, base) {
  var dir = base || app.env.templates || path.join(__dirname, 'templates');
  var absolute = path.resolve(path.resolve(dir), filepath);
  return {
    contents: fs.readFileSync(absolute),
    path: absolute,
  };
}

/**
 * Returns true if `app` is a valid "smart plugin" instance.
 *
 * @param {Object} `app`
 * @return {Boolean}
 */

function isValidInstance(app) {
  if (!app.isApp && !app.isGenerator && !app.isVerb) {
    return false;
  }
  if (app.isRegistered('verb-readme-generator')) {
    return false;
  }
  return true;
}
