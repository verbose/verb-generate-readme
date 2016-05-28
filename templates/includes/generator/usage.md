This generator may be used a generate plugin, generator or sub-generator, or as a node.js library as a part of your own application.

### Install locally

**Install generate locally**

{%= include("install-npm") %}


Then use in your project:

```js
var {%= alias %} = require('{%= name %}');
```

### plugin usage

**Use as a plugin in your app**

In your [generate][] project:

```js
var generate = require('generate');
var app = generate();

app.use({%= alias %});
```


**Use as a plugin in your generator**

In your [generate][] generator:

```js
module.exports = function(app) {
  app.use({%= alias %});
};
```

### generator usage


**Use as a sub-generator**

In your [generate][] generator:

```js
module.exports = function(app) {
  // name the sub-generator whatever you want
  app.register('foo', require('{%= name %}'));
};
```
