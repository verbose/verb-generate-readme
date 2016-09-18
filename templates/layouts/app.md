---
layout: nil
---

{%= include(name + "/logo", {size: name === suite.name ? 250 : 150}) %}
{%= include(name + "/header") %}

{%= ifExists(["docs/demo.gif", "demo.gif"], section("demo.md")) %}

{% body %}

## About
### Related projects
{%= section("related", related(verb.related.list)) %}

### Community
{%= include("generate/community") %}

### Contributing
{%= include("contributing") %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= license %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
