'use strict';

const sections = require('sections');

module.exports = function(app, file, next) {
  if (Array.isArray(app.options.titles)) {
    const obj = sections.parse(file.content);
    file.content = sections.render(obj, app.options.titles);
  }
  next(null, file);
};
