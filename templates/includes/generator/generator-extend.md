## Extend your generator

The [usage instructions](#usage) explain how to use this as a standalone generator, but you can also use `{%= name %}` to extend your own generator, and cut down on boilerplate code needed to get up and running.

To extend your generator, add the  `.extendWith()` line inside your generator:

```js
var {%= alias %} = require('{%= name %}');

module.exports = function(app) {
  {%= alias %}.invoke(app[, options]);

  // do generator stuff
};
```

That's it! you should now be able to use any features from `{%= name %}` as if they were created in your own generator.

**Override settings**

You can override any feature or setting from `{%= name %}` by defining new values. E.g. we aren't doing any magic, the `.invoke` method just calls this generator in the context of your generator's instance.