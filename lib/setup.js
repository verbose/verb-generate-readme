'use strict';

var utils = require('./utils');

/**
 * This will be externalized
 */

exports.options = function(app) {
  if (app.isGenerator) {
    app.option('toAlias', utils.createMatcher(/^generate-/));
  }
  if (app.isUpdate) {
    app.option('toAlias', utils.createMatcher(/^updater-/));
  }
  if (!app.data('verb.related.list')) {
    app.data('verb.related.list', []);
  }
};

exports.data = function(app) {
  var data = suiteContext(app);

  app.data({
    runner: require('../package'),
    prefix: 'Copyright',
    platform: data,
    suite: data,
    links: {
      generate: {
        repo: 'https://github.com/generate/generate',
        bugs: 'https://github.com/generate/generate/issues',
        docs: 'https://github.com/generate/generate/blob/master/docs/',
        getting_started: 'https://github.com/generate/getting-started'
      },
      assemble: {
        repo: 'https://github.com/assemble/assemble',
        docs: 'https://github.com/assemble/assemble/blob/master/docs/',
        bugs: 'https://github.com/assemble/assemble/issues',
        getting_started: 'https://github.com/assemble/getting-started'
      },
      verb: {
        repo: 'https://github.com/verbose/verb',
        bugs: 'https://github.com/verbose/verb/issues',
        docs: 'https://github.com/verbose/verb/blob/master/docs/',
        getting_started: 'https://github.com/verb/getting-started'
      },
      update: {
        repo: 'https://github.com/update/update',
        bugs: 'https://github.com/update/update/issues',
        docs: 'https://github.com/update/update/blob/master/docs/',
        getting_started: 'https://github.com/update/getting-started'
      }
    }
  });
};

function suiteContext(app) {
  var obj = {};

  var name = app.pkg.get('name');
  app.data('name', name);

  if (/^base-?/.test(name)) {
    obj.repo = 'node-base/base';
    obj.docs = `https://github.com/${obj.repo}/blob/master/docs`;
    obj.proper = 'Base';
    obj.name = 'base';
    obj.command = 'base';
    obj.configname = 'basefile';
    obj.configfile = 'basefile.js';
  } else if (/^assemble-?/.test(name)) {
    obj.repo = 'assemble/assemble';
    obj.docs = `https://github.com/${obj.repo}/blob/master/docs`;
    obj.proper = 'Assemble';
    obj.name = 'assemble';
    obj.command = 'assemble';
    obj.configname = 'assemblefile';
    obj.configfile = 'assemblefile.js';
  } else if (/^generate-?/.test(name)) {
    obj.repo = 'generate/generate';
    obj.docs = `https://github.com/${obj.repo}/blob/master/docs`;
    obj.proper = 'Generate';
    obj.name = 'generate';
    obj.command = 'gen';
    obj.configname = 'generator';
    obj.configfile = 'generator.js';
  } else if (/^(updater-?|update)/.test(name)) {
    obj.repo = 'update/update';
    obj.docs = `https://github.com/${obj.repo}/blob/master/docs`;
    obj.proper = 'Update';
    obj.name = 'update';
    obj.command = 'update';
    obj.configname = 'updater';
    obj.configfile = 'updatefile.js';
  } else if (/^verb-?/.test(name)) {
    obj.repo = 'verbose/verb';
    obj.docs = `https://github.com/${obj.repo}/blob/master/docs`;
    obj.proper = 'Verb';
    obj.name = 'verb';
    obj.command = 'verb';
    obj.configname = 'verbfile';
    obj.configfile = 'verbfile.js';
  }
  return obj;
}
