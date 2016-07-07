**Install locally**

{%= include("install-npm", {save: true}) %}

Then use in your project:

```js
var {%= strip(platform.name + '-', name) %} = require('{%= name %}');
```
