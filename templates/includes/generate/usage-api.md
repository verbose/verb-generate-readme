### Install locally

If you want to use `{%= name %}` as a plugin or sub-generator to extend the features and settings in your own generator, you must first install it locally:

{%= include("install-npm", {save: true}) %}

### Use as a plugin

Use as a [plugin]({%= platform.docs %}/plugins.md) if you want to extend your own generator with the features, settings and tasks of `{%= name %}`, as if they were created on your generator:

```js
module.exports = function(app) {
  app.use(require('{%= name %}'));
};
```

Visit Generate's [plugin docs]({%= platform.docs %}/plugins.md) to learn more about plugins.

### Use as a sub-generator

Use as a [sub-generator]({%= platform.docs %}/generators.md) if you want to add `{%= name %}` to a  _namespace_ in your generator:

```js
module.exports = function(app) {
  // register the {%= name %} with whatever name you want
  app.register('foo', require('{%= name %}'));
};
```

Visit Generate's [sub-generator docs]({%= platform.docs %}/sub-generators.md) to learn more about sub-generators.
