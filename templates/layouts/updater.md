---
layout: nil
---

{%= include("update/logo") %}
{%= include("update/header") %}

![{%= name %} demo](https://raw.githubusercontent.com/{%= repo %}/master/docs/demo.gif)

{%= include("toc") %}

## What is "Update"?
{%= include("update/what-is-update") %}

{% body %}

## About
### Related projects
{%= section("related", related(verb.related.list)) %}

### Community
{%= include("update/community") %}

### Contributing
{%= include("contributing") %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= licenseStatement || (license ? ("Released under the " + license + " License.") : "MIT") %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
