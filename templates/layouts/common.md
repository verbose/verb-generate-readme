---
layout: nil
---

{%= include("header") %}

{%= include("highlight") %}

## TOC
<!-- toc -->

{% body %}

## Related projects
{%= include("related-list") %}

## Contributing
{%= include("contributing") %}

## Building docs
{%= include("build-docs") %}

## Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

## Author
{%= includeEither("authors", "author") %}

## License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= before.license ? (before.license + "\n") : "" %}{%= license %}{%= after.license ? (after.license + "\n") : "" %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
