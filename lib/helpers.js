'use strict';

var toc = require('markdown-toc');
var utils = require('./utils');
var cache = {};

module.exports = function(app) {
  app.helper('toc', function(str) {
    return toc(str).content + '\n\n' + str;
  });

  app.helper('list', function(list) {
    return '- ' + list.keys.join('\n- ');
  });

  app.helper('headings', function(str) {
    return str.replace(/^### /gm, '#### ');
  });

  app.helper('get', function(prop, obj) {
    // console.log(this.context)
    return utils.get(obj, prop) || '';
  });

  app.helper('repo', function(name) {
    return `https://github.com/${name}`;
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
};
