'use strict';

var utils = require('./utils');
var cache = {};

module.exports = function(app) {

  app.asyncHelper('section', function(name, cb) {
    var view = app.includes.getView(name);
    if (typeof view === 'undefined') {
      cb(null, '');
      return;
    }
    app.render(view, function(err, res) {
      if (err) return cb(err);
      cb(null, res.content);
    });
  });

  app.asyncHelper('block', function(name, options, cb) {
    app.include(name, options.fn(this));
    cb(null, '');
  });

  app.helper('headings', function(str) {
    return str.replace(/^### /gm, '#### ');
  });

  app.asyncHelper('ifExists', function(files, val, cb) {
    if (utils.exists(files, app.cwd)) {
      cb(null, val);
    } else {
      cb(null, '');
    }
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
    var include = app.getAsyncHelper('include');
    include.apply(this, arguments);
  });
};
