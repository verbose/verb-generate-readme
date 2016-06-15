This updater can also be used as a node.js library in your own updater. 

**Use as a plugin in your updater**

Use as a plugin if you want to extend your own updater with the features, settings and tasks of {%= name %}, as if they were created on your updater.

In your `updatefile.js`:

```js
module.exports = function(app) {
  app.use(require('{%= name %}'));

  // specify any tasks from {%= name %}. Example:
  app.task('default', ['{%= alias %}']);
};
```

**Use as a sub-updater**

Use as a sub-updater if you want expose the features, settings and tasks from {%= name %} on a _namespace_ in your updater. 

In your `updatefile.js`:

```js
module.exports = function(app) {
  // register the {%= name %} updater (as a sub-updater with an arbitrary name)
  app.register('foo', require('{%= name %}'));

  app.task('minify', function(cb) {
    // minify some stuff
    cb();
  });

  // run the "default" task on {%= name %} (aliased as `foo`), 
  // then run the `minify` task defined in our updater
  app.task('default', function(cb) {
    app.update(['foo:default', 'minify'], cb);
  });
};
```

Tasks from `{%= name %}` will be available on the `foo` namespace from the API and the command line. Continuing with the previous code example, to run the `default` task on `{%= name %}`, you would run `gen foo:default` (or just `gen foo` if `foo` does not conflict with an existing task on your updater).

To learn more about namespaces and sub-updaters, and how they work, [visit the getting started guide]({%= links.update.getting_started %}).