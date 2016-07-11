---
layout: nil
---

{%= include("header") %}

## TOC
<!-- toc -->

{% body %}

## About
### Related projects
{%= section("related", related(verb.related.list)) %}

### Contributing
{%= include("contributing") %}

### Building docs
{%= include("build-docs") %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= before.license ? (before.license + "\n") : "" %}{%= license %}{%= after.license ? (after.license + "\n") : "" %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
