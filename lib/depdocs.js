'use strict';

var fs = require('fs');
var path = require('path');
var resolve = require('resolve');
var sections = require('sections');

module.exports = function(app) {
  app.helper('depdocs', function(name, locals) {
    try {
      var apidocs = this.app.getHelper('apidocs');
      var dep = path.resolve(app.cwd, 'node_modules', name);
      var fp = resolve.sync(dep);
      var res = apidocs.call(this, fp, locals || {});
      return res;
    } catch (err) {
      return '';
    }
  });
};
