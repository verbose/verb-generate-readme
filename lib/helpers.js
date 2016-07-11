'use strict';

var toc = require('markdown-toc');
var utils = require('./utils');
var cache = {};

module.exports = function(app) {
  var warned;
  app.helper('toc', function(str) {
    return toc(str).content + '\n\n' + str;
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
    return `https://github.com/${repo}/blob/master/${filepath}`;
  });

  app.helper('headings', function(str) {
    if (!warned) {
      warned = true;
      app.log.warn('the `headings` helper was renamed to `increaseHeadings`, use that helper instead.');
    }
    return str.replace(/^(#+)/gm, '#$1');
  });

  app.helper('increaseHeadings', function(str) {
    return str.replace(/^(#+)/gm, '#$1');
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
