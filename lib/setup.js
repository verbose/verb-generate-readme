'use strict';

var utils = require('./utils');

/**
 * This will be externalized
 */

exports.options = function(app) {
  if (app.isGenerator) {
    app.option('toAlias', function(name) {
      return utils.camelcase(name.replace(/^generate-/, ''));
    });
  }

  if (app.isUpdate) {
    app.option('toAlias', function(name) {
      return utils.camelcase(name.replace(/^updater-/, ''));
    });
  }
};

exports.data = function(app) {
  var data = suiteContext(app);
  app.data('suite', data);
  app.base.data('suite', data);
  app.data('platform', data);
  app.base.data('platform', data);

  app.data({
    links: {
      verb: {
        repo: 'https://github.com/verbose/verb',
        bugs: 'https://github.com/verbose/verb/issues',
        getting_started: 'https://github.com/verb/getting-started'
      },
      generate: {
        repo: 'https://github.com/generate/generate',
        bugs: 'https://github.com/generate/generate/issues',
        getting_started: 'https://github.com/generate/getting-started'
      },
      update: {
        repo: 'https://github.com/update/update',
        bugs: 'https://github.com/update/update/issues',
        getting_started: 'https://github.com/update/getting-started'
      }
    }
  });
};

function suiteContext(app) {
  var name = app.pkg.get('name');
  var obj = {};

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
