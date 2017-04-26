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
    str = tables(str, file);

    var blocks = gfm(str);
    file.gfm = {};

    for (var i = 0; i < blocks.length; i++) {
      var obj = blocks[i];
      var key = '^^GFM_' + i + '^^';
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
    str = restore(str, file, 'gfm');
    str = restore(str, file, 'tables');
    str = str.replace(/\|  `/g, '| `');

    file.contents = new Buffer(str);
    next(null, file);
  });
};

function restore(str, file, prop) {
  if (!file[prop]) return str;

  var keys = Object.keys(file[prop]);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    str = str.split(key).join(file[prop][key]);
  }
  return str;
}

function tables(str, file) {
  file.tables = {};
  var table = '';

  var lines = str.split('\n');
  var len = lines.length;
  var idx = -1;
  var num = 0;
  var res = '';

  while (++idx < len) {
    var line = lines[idx];
    if (/^ *\|/.test(line) && /\| *$/.test(line)) {
      table += escapeBarsInCode(line) + '\n';
    } else if (table) {
      var key = '^^table' + (num++) + '^^';
      file.tables[key] = table;
      table = '';
      res += key + '\n';
    } else {
      res += line + '\n';
    }
  }

  return res;
}

function escapeBarsInCode(str) {
  var re = /(?:^|\s)`([^`]+)`(?!`)/gm;
  var match;
  while ((match = re.exec(str))) {
    var val = match[1].split(/\\?\|/).join('\\|');
    str = str.replace(match[1], val);
  }
  return str;
}

function code(str, file) {
  file.code = {};

  var re = /(?:^|\s)(`[^`]+`)(?!`)/;
  var matches = 0;
  var match;

  while ((match = re.exec(str))) {
    var key = '^^CODE_' + (matches++) + '^^';
    file.code[key] = match[0];
    var tail = str.slice(match.index + match[0].length);
    str = str.slice(0, match.index) + key + tail;
  }

  return str;
}
