'use strict';

module.exports = {
  bower: '[![Bower version](https://img.shields.io/bower/v/{%= name %}.svg?style=flat)]',
  
  travis: '[![Build Status](https://img.shields.io/travis/{%= repository %}.svg?style=flat)](https://travis-ci.org/{%= repository %})',

  fury: '[![NPM version](https://img.shields.io/npm/v/{%= name %}.svg?style=flat)](https://www.npmjs.com/package/{%= name %})',

  npm: '[![NPM version](https://img.shields.io/npm/v/{%= name %}.svg?style=flat)](https://www.npmjs.com/package/{%= name %})',

  downloads: '[![NPM downloads](https://img.shields.io/npm/dm/{%= name %}.svg?style=flat)](https://npmjs.org/package/{%= name %})',

  coveralls: '[![Coverage Status](https://img.shields.io/coveralls/{%= repository %}.svg?style=flat)](https://coveralls.io/r/{%= repository %})'
};
