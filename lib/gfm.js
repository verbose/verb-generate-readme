'use strict';

var gfm = require('gfm-code-blocks');
var through = require('through2');

exports.replace = function(options) {
  return through.obj(function(file, enc, next) {
    if (file.isNull() || file.isStream()) {
      next(null, file);
      return;
    }

    var str = file.contents.toString();
    var blocks = gfm(str);
    file.gfm = {};

    for (var i = 0; i < blocks.length; i++) {
      var obj = blocks[i];
      var key = '__GFM_(' + i + ')__';
      file.gfm[key] = obj.block;
      str = str.replace(obj.block, key);
    }

    file.contents = new Buffer(str);
    next(null, file);
  });
};

exports.restore = function(options) {
  return through.obj(function(file, enc, next) {
    if (file.isNull() || file.isStream()) {
      next(null, file);
      return;
    }

    var str = file.contents.toString();
    for (var key in file.gfm) {
      if (file.gfm.hasOwnProperty(key)) {
        str = str.replace(key, file.gfm[key]);
      }
    }

    file.contents = new Buffer(str);
    next(null, file);
  });
};
