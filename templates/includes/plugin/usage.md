## Usage

```js
var Base = require('base');
var env = require('{%= name %}');
```

**Prototype plugin**

Register as a prototype plugin if you want the `.createEnv` method to be added to all instances of `base`:

```js
Base.use(env());
```

**Instance plugin**

Register as an instance plugin if you only want the `.createEnv` method to be added to a specific instance:

```js
var base = new Base();
base.use(env());
```