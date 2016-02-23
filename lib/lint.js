'use strict';

/**
 * If the user has a layout defined, but a template also has layout
 * code in it, inform the user.
 */

exports.layout = function(app) {
  app.set('cache.readmeWarnings', []);

  return function(file, next) {
    var name = file.basename;
    if (file.layout && hasLayoutCode(file.content)) {
      union(app, file.basename, 'layout defined, but layout content was also detected');
    }
    next();
  };
};

function hasLayoutCode(str) {
  if (/^# \{%= name %\}/.test(str)) {
    return true;
  }
  if (/\{%= license %\}/.test(str)) {
    return true;
  }
  if (/## Install/.test(str)) {
    return true;
  }
}

function union(app, filename, msg) {
  var prop = 'cache.readmeWarnings';
  var arr = app.get(prop) || [];
  arr.push({filename: filename, message: msg});
  app.set(prop, arr);
}
