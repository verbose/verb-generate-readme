'use strict';

const fs = require('fs');
const path = require('path');
const debug = require('debug')('verb-generate-readme');
const through = require('through2');
const placements = require('./lib/placements');
const sections = require('./lib/sections');
const helpers = require('./lib/helpers');
const options = require('./lib/options');
const setup = require('./lib/setup');
const utils = require('./lib/utils');
const gfm = require('./lib/gfm');

/**
 * Verb readme generator
 */

function generator(app, base) {
  if (!utils.isValid(app, 'verb-readme-generator')) return;
  app.cwd = process.cwd();

  /**
   * Listeners
   */

  app.on('view', view => {
    view.extname = view.extname || '.md';
  });

  /**
   * Init options
   */

  options(app);
  app.option(app.pkg.get('verb') || {});

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

  app.task('readme-render', {silent: true}, function() {
    debug(`starting task: ${this.name}`, __filename);
    const srcBase = app.options.srcBase || app.cwd;
    const file = app.options.readme || '.verb.md';

    app.data('pkg', require(path.join(process.cwd(), 'package.json')));
    app.data('author.linkedin', app.data('author.linkedin') || 'jonschlinkert');
    app.data('author.twitter', app.data('author.twitter') || 'jonschlinkert');

    return app.src(file, {cwd: srcBase})
      .pipe(through.obj((file, enc, next) => {
        let print = app.options.pp;
        if (print) {
          let str = `{%= print(${print}) %}\n` + file.contents.toString();
          file.contents = Buffer.from(str);
        }
        next(null, file);
      }))
      .pipe(app.renderFile('*'))
      .pipe(gfm.replace())
      .pipe(utils.handle.once(app, 'prePipeline'))
      .pipe(utils.reflinks(app.options))
      .pipe(app.pipeline(app.options.pipeline))
      .pipe(gfm.restore())
      .pipe(app.dest(file => {
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

  app.task('readme-middleware', { silent: true }, cb => {
    app.handler('prePipeline');
    app.preRender(/(verb|readme)\.md$/i, (file, next) => {
      utils.del(path.resolve(app.cwd, 'readme.md'), next);
    });
    app.preWrite(/\.md$/, (file, next) => {
      app.union('cache.reflinks', file._reflinks);
      placements(app, file, err => {
        if (err) {
          next(err);
          return;
        }
        sections(app, file, next);
      });
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

  app.task('readme-data', { silent: true }, cb => {
    app.data({bower: fs.existsSync(path.join(app.cwd, 'bower.json'))});
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

  app.task('readme-templates', { silent: true }, cb => {
    let templates = path.resolve.bind(path, __dirname, 'templates');
    let config = app.base.get('cache.config') || {};

    // load default docs
    app.docs('*.md', {cwd: templates('docs')});

    // load `layout` templates
    app.layouts('*.md', { cwd: templates('layouts') });
    app.includes('**/*.md', { cwd: templates('includes') });
    app.includes(require('./templates/includes'));
    app.badges(require('./templates/badges'));

    // load `docs` templates from user `./docs` or specified dir
    let docs = path.resolve(app.cwd, 'docs');
    if (fs.existsSync(docs) && app.pkg.get('verb.options.docs') !== false) {
      app.docs('**/*.md', { cwd: docs });
    }

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

  app.task('readme-reflinks', {silent: true}, cb => {
    let existing = app.pkg.get('verb.reflinks') || [];
    let reflinks = app.get('cache.reflinks') || [];
    let diff = utils.diff(reflinks, existing);
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
    debug(`starting task: ${this.name}`, __filename);
    let cwd = app.options.srcBase || path.join(__dirname, 'templates/verbmd');
    return app.src('basic.md', { cwd })
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
    if (fs.existsSync('.verb.md')) return cb();
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

  return generator;
}

/**
 * Expose `generator`
 */

module.exports = generator;
