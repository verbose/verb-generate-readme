---
layout: nil
---
{% body %}

## Author
{%= includeEither("authors", "author") %}

## License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= before.license ? (before.license + "\n") : "" %}{%= license %}{%= after.license ? (after.license + "\n") : "" %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
