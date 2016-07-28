'use strict';

var utils = require('./utils');

module.exports = function(app, file, cb) {
  var opts = app.option('sections');
  appendExamples(opts || {});

  if (typeof opts === 'undefined' || opts === false || !Array.isArray(opts.placements)) {
    cb();
    return;
  }

  if (opts.file && file.stem.toLowerCase() !== opts.file.toLowerCase()) {
    cb();
    return;
  }

  var str = file.contents.toString();

  utils.each(opts.placements, function(section, next) {
    renderString(app, section.contents, function(err, view) {
      if (err) {
        next(err);
        return;
      }

      var opts = section.options || {};
      if (typeof opts.match === 'string' && opts.match.charAt(0) === '^') {
        opts.match = new RegExp(opts.match);
      }
      str = utils.update(str, section.heading, view.content, section.placement, opts);
      next();
    });
  }, function(err) {
    if (err) return cb(err);
    file.contents = new Buffer(str);
    cb();
  });
};

function appendExamples(opts) {
  var examples = opts.taskExamples;
  if (Array.isArray(examples)) {
    opts.placements = (opts.placements || []).concat(examples.map(example));
  } else if (typeof opts.placements === 'undefined') {
    return;
  }
  return opts;
}

function example(name) {
  return {
    heading: name,
    contents: `{%= doc("example-${name}.md") %}`,
    placement: 'append',
    options: {
      match: `^\\[${name}\\]`
    }
  };
}

function renderString(app, str, cb) {
  var view = app.view({path: 'string', content: str, engine: '*', layout: false});
  app.render(view, cb);
}
