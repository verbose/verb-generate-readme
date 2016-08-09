---
layout: nil
---

{%= include(name + "/logo", {size: name === suite.name ? 250 : 150}) %}
{%= include(name + "/header") %}

![{%= name %} demo](https://raw.githubusercontent.com/{%= repo %}/master/docs/demo.gif)

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
