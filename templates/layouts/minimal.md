---
layout: nil
---
{% body %}

## Author
{%= includeEither("authors", "author") %}

## License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= licenseStatement || (license ? ("Released under the " + license + " License.") : "MIT") %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
