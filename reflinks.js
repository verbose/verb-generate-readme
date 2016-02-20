'use strict';

/**
 * Lint readme.md for missing reflinks, and add them to
 * package.json if enabled by the user.
 */

module.exports = function(app) {
  var reflinks = [];
  var re = /(\[[\w._-]+?\]\[\])/g;

  var keys = app.pkg.get('verb.reflinks') || [];
  var added = false;
  var count = 0;

  return function(file, next) {
    var matches = file.content.match(re);

    if (matches && matches.length) {
      matches.forEach(function(match) {
        var idx = match.indexOf(']');
        var name = match.slice(1, idx).trim();
        if (!has(reflinks, name) && !has(keys, name)) {
          reflinks.push(name);
          count++;
        }
      });
    }

    if (count > 0 && !added) {
      added = true;
      var obj = {config: {reflinks: reflinks}};
      app.cli.process(obj, next);
    } else {
      next();
    }
  };
};

function has(keys, key) {
  return keys.indexOf(key.trim()) !== -1;
}
