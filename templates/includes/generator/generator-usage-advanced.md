## Advanced usage

**Lazily-extend your generator**

Run the `{%= alias %}` task to lazily add the features and settings from `{%= name %}`.

This approach offers the advantage of choosing when and where to invoke `{%= name %}` inside your own generator.

```js
module.exports = function(app) {
  app.extendWith(require('{%= name %}'));

  app.task('foo', function(cb) {
    // do task stuff
    cb();
  });

  app.task('default', ['{%= alias %}', 'foo']);
};
```

**Note that** _before running task `foo`, you MUST RUN the `{%= alias %}` task_ to get the features from `{%= name %}` loaded onto your generator's instance.