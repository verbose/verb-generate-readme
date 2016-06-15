'use strict';

var added = false;

/**
 * Lint readme.md for missing reflinks, and add them to
 * package.json if enabled by the user.
 */

module.exports = function(app) {
  var re = /(\[[\w._-]+?\]\[\])/g;
  var count = 0;

  var reflinks = app.pkg.get('verb.reflinks') || [];
  if (typeof reflinks === 'string') {
    reflinks = [reflinks];
  } else if (!Array.isArray(reflinks)) {
    reflinks = [];
  }

  return function(file, next) {
    var matches = file.content.match(re);
    if (matches && matches.length) {
      matches.forEach(function(match) {
        var idx = match.indexOf(']');
        var name = match.slice(1, idx).trim();
        if (reflinks.indexOf(name) === -1) {
          reflinks.push(name);
          count++;
        }
      });
    }

    if (count > 0 && !added) {
      added = true;
      app.pkg.set('verb.reflinks', reflinks);
      app.pkg.logInfo('updated package.json with:', {reflinks: reflinks});
      app.pkg.save();
      next();
    } else {
      next();
    }
  };
};
