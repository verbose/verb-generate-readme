'use strict';

var update = require('update-sections');
var async = require('async');

module.exports = function(app) {
  return function(file, cb) {
    var opts = app.option('sections');

    if (typeof opts === 'undefined' || !Array.isArray(opts.placement)) {
      cb();
      return;
    }

    if (opts.layout && file.stem !== opts.layout) {
      cb();
      return;
    }

    var str = file.contents.toString();

    async.each(opts.placement, function(section, next) {
      str = update(str, section.heading, section.contents, section.placement);
      next();
    }, function(err) {
      if (err) {
        cb(err);
      } else {
        file.contents = new Buffer(str);
        cb();
      }
    });
  };
};
