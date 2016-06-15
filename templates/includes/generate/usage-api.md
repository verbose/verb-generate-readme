This updater can also be used as a node.js library in your own updater. To do so you must first install {%= name %} locally.

**Install**

{%= include("install-npm", {save: true}) %}

**Use as a plugin in your generator**

Use as a plugin if you want to extend your own generator with the features, settings and tasks of {%= name %}, as if they were created on your generator.

In your `generator.js`:

```js
module.exports = function(app) {
  app.use(require('{%= name %}'));

  // specify any tasks from {%= name %}. Example:
  app.task('default', ['{%= alias %}']);
};
```

**Use as a sub-generator**

Use as a sub-generator if you want expose the features, settings and tasks from {%= name %} on a _namespace_ in your generator. 

In your `generator.js`:

```js
module.exports = function(app) {
  // register the {%= name %} generator (as a sub-generator with an arbitrary name)
  app.register('foo', require('{%= name %}'));

  app.task('minify', function(cb) {
    // minify some stuff
    cb();
  });

  // run the "default" task on {%= name %} (aliased as `foo`), 
  // then run the `minify` task defined in our generator
  app.task('default', function(cb) {
    app.generate(['foo:default', 'minify'], cb);
  });
};
```

Tasks from `{%= name %}` will be available on the `foo` namespace from the API and the command line. Continuing with the previous code example, to run the `default` task on `{%= name %}`, you would run `gen foo:default` (or just `gen foo` if `foo` does not conflict with an existing task on your generator).

To learn more about namespaces and sub-generators, and how they work, [visit the getting started guide]({%= links.generate.getting_started %}).