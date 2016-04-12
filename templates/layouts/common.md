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
{%= include("tests") %}

## Author
{%= include("author") %}

## License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= license %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
