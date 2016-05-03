'use strict';

module.exports = function(app) {
  app.asyncHelper('includeEither', function(a, b, cb) {
    var include = app.getAsyncHelper('include');
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
    include.apply(this, arguments);
  });
};
