'use strict';

var fs = require('fs');
var path = require('path');
var debug = require('debug')('verb-generate-readme');
var options = require('./lib/options');
var sections = require('./lib/sections');
var helpers = require('./lib/helpers');
var setup = require('./lib/setup');
var utils = require('./lib/utils');

/**
 * Verb readme generator
 */

function generator(app, base) {
  if (!utils.isValid(app, 'verb-readme-generator')) return;

  /**
   * Init options
   */

  options(app);

  /**
   * Plugins
   */

  app.use(require('verb-defaults'));
  app.use(require('verb-collections'));
  app.use(require('verb-repo-helpers'));
  app.use(require('verb-repo-data'));
  app.use(require('verb-toc'));

  /**
   * Engine
   */

  app.engine('hbs', require('engine-handlebars'));
  app.engine('md', app.getEngine('.*'));

  /**
   * Helpers
   */

  helpers(app);
  setup.options(app);
  setup.data(app);

  /**
   * Alias for the [readme]() task, generates a README.md to the user's working directory.
   *
   * ```sh
   * $ verb readme
   * ```
   * @name default
   * @api public
   */

  app.task('default', ['verbmd-prompt', 'readme']);

  /**
   * Generate `README.md` and fix missing [reflinks](#reflinks).
   *
   * ```sh
   * $ verb readme
   * ```
   * @name readme
   * @api public
   */

  app.task('readme', [
    'readme-middleware',
    'readme-templates',
    'readme-data',
    'readme-render',
    'readme-reflinks'
  ]);

  /**
   * Generate a README.md from a `.verb.md` template. Runs the [setup](), and [verbmd]() tasks.
   * This is a [verb][docs]{tasks.md#silent} task.
   *
   * ```sh
   * $ verb readme:readme-render
   * ```
   * @name readme-render
   */

  app.task('readme-render', {silent: true}, function(cb) {
    debug('starting readme task');
    var srcBase = app.options.srcBase || app.cwd;
    var file = app.options.readme || '.verb.md';

    return app.src(file, {cwd: srcBase})
      .pipe(app.renderFile('hbs', app.cache.data))
      .pipe(app.renderFile('md', app.cache.data))
      .pipe(utils.handle.once(app, 'prePipeline'))
      .pipe(utils.reflinks(app.options))
      .pipe(app.pipeline(app.options.pipeline))
      .pipe(app.dest(function(file) {
        app.base.emit('dest', file);
        file.basename = 'README.md';
        return app.cwd;
      }));
  });

  /**
   * Initialize middleware used for rendering the [readme](#readme).
   *
   * ```sh
   * $ verb readme:readme-middleware
   * ```
   * @name readme-middleware
   */

  app.task('readme-middleware', { silent: true }, function(cb) {
    app.handler('prePipeline');
    app.preRender(/(verb|readme)\.md$/i, function(file, next) {
      utils.del(path.resolve(app.cwd, 'readme.md'), next);
    });
    app.preWrite(/\.md$/, function(file, next) {
      app.union('cache.reflinks', file._reflinks);
      sections(app, file, next);
    });
    cb();
  });

  /**
   * Loads data to used for rendering templates. Called by the [readme]() task.
   *
   * ```sh
   * $ verb readme:readme-data
   * ```
   * @name readme-data
   */

  app.task('readme-data', { silent: true }, function(cb) {
    if (utils.exists(path.join(app.cwd, 'bower.json'))) {
      app.data({bower: true});
    }
    cb();
  });

  /**
   * Load layouts, includes and badges commonly used for generating a README.md.
   *
   * ```sh
   * $ verb readme:readme-templates
   * ```
   * @name readme-templates
   */

  app.task('readme-templates', { silent: true }, function(cb) {
    var templates = path.join.bind(path, __dirname, 'templates');
    var config = app.base.get('cache.config') || {};

    // load default docs
    app.docs('*.md', {cwd: templates('docs')});

    // load `docs` templates from user `./docs` or specified dir
    var docs = path.join(app.cwd, 'docs');
    if (utils.exists(docs) && app.pkg.get('verb.options.docs') !== false) {
      app.docs('*.md', { cwd: docs });
    }

    // load `layout` templates
    app.layouts('*.md', { cwd: templates('layouts') });
    app.includes('**/*.md', { cwd: templates('includes') });
    app.includes(require('./templates/includes'));
    app.badges(require('./templates/badges'));

    // call `.config.process` again to override built-in templates
    // with any templates defined in `package.json`
    if (typeof config.views !== 'undefined') {
      app.config.process({views: config.views}, cb);
    } else {
      cb();
    }
  });

  /**
   * Run after other tasks to get any missing reflinks found in rendered markdown
   * documents, and add them to the `verb.reflinks` array in package.json. Verb
   * uses this array to generate reflinks so that missing reflinks will still resolve.
   *
   * ```sh
   * $ verb readme:readme-reflinks
   * ```
   * @name readme-reflinks
   */

  app.task('readme-reflinks', {silent: true}, function(cb) {
    var existing = app.pkg.get('verb.reflinks') || [];
    var reflinks = app.get('cache.reflinks') || [];
    var diff = utils.diff(reflinks, existing);
    if (diff.length > 1) {
      app.pkg.union('verb.reflinks', diff);
      app.pkg.save();
      app.pkg.logInfo('updated package.json with:', {reflinks: diff});
    }
    cb();
  });

  /**
   * Generate a new `.verb.md` template to the current working directory. This task is
   * also aliased as `verbmd-new` to provide a semantic task name when this generator is
   * used as a plugin.
   *
   * ```sh
   * $ verb readme:new
   * # or
   * $ verb readme:verbmd-new
   * ```
   * @name new
   */

  app.task('new', ['verbmd-new']);
  app.task('verbmd-new', function() {
    var cwd = app.options.srcBase || path.join(__dirname, 'templates/verbmd');
    return app.src('basic.md', {cwd: cwd})
      .pipe(app.renderFile({layout: app.pkg.get('verb.layout') || false}))
      .pipe(utils.through.obj(function(file, enc, next) {
        var readme = app.get('cache.readme');
        if (readme) {
          file.contents = readme;
        }
        next(null, file);
      }))
      .pipe(app.conflicts(app.cwd))
      .pipe(app.dest(app.cwd));
  });

  /**
   * Prompts the user to add a new `.verb.md` template to the current working directory.
   * Useful in sub-generators.
   *
   * ```sh
   * $ verb readme:verbmd-prompt
   * # alias aliased as
   * $ verb readme:ask
   * ```
   * @name verbmd-prompt
   */

  app.task('verbmd-prompt', {silent: true}, function(cb) {
    if (utils.exists('.verb.md')) return cb();
    app.confirm('verbmd', 'Can\'t find a .verb.md, want to add one?');
    app.ask('verbmd', { save: false }, function(err, answers) {
      if (err) return cb(err);
      if (answers.verbmd) {
        var readme = path.join(app.cwd, 'README.md');
        if (utils.exists(readme)) {
          app.set('cache.readme', fs.readFileSync(readme));
        }
        app.build('new', cb);
      } else {
        cb();
      }
    });
  });

  return generator;
}

/**
 * Expose `generator`
 */

module.exports = generator;
