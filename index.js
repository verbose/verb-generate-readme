/*!
 * verb-generate-readme <https://github.com/jonschlinkert/verb-generate-readme>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function(verb, base) {
  verb.invoke('verb-generate-templates');
  verb.invoke('verb-generate-includes');
  verb.invoke('verb-generate-layouts');
  verb.invoke(require('./verbfile'));

  verb.task('readme', function(cb) {
    // console.log(verb)
    // verb.generate('foo:bar', cb);
    cb();
  });

  verb.register('foo', function(foo) {
    foo.task('bar', function(cb) {
      console.log('generated readme!');
      cb();
    });
  });

  verb.task('default', ['readme']);
};
