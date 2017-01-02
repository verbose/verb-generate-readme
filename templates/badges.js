'use strict';

module.exports = {
  appveyor: '[![Windows Build Status](https://img.shields.io/appveyor/ci/{%= repository %}.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/{%= repository %})',

  bower: '[![Bower version](https://img.shields.io/bower/v/{%= name %}.svg?style=flat)]',

  coveralls: '[![Coverage Status](https://img.shields.io/coveralls/{%= repository %}.svg?style=flat)](https://coveralls.io/r/{%= repository %})',

  downloads: '[![NPM monthly downloads](https://img.shields.io/npm/dm/{%= name %}.svg?style=flat)](https://npmjs.org/package/{%= name %})',

  'npm-downloads-monthly': '[![NPM monthly downloads](https://img.shields.io/npm/dm/{%= name %}.svg?style=flat)](https://npmjs.org/package/{%= name %})',

  'npm-downloads-total': '[![NPM total downloads](https://img.shields.io/npm/dt/{%= name %}.svg?style=flat)](https://npmjs.org/package/{%= name %})',

  gitter: '[![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/{%= repository %})',

  fury: '[![NPM version](https://img.shields.io/npm/v/{%= name %}.svg?style=flat)](https://www.npmjs.com/package/{%= name %})',
  npm: '[![NPM version](https://img.shields.io/npm/v/{%= name %}.svg?style=flat)](https://www.npmjs.com/package/{%= name %})',

  travis: '[![Build Status](https://img.shields.io/travis/{%= repository %}.svg?style=flat)](https://travis-ci.org/{%= repository %})',

  travisLinus: '[![Linux Build Status](https://img.shields.io/travis/{%= repository %}.svg?style=flat&label=Travis)](https://travis-ci.org/{%= repository %})',
};
