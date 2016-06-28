---
layout: nil
---

{%= include("header") %}

## TOC
<!-- toc -->

{% body %}

## Related projects
{%= include("related-list") %}

## Contributing
{%= include("contributing") %}

## Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

## Author
{%= includeEither("authors", "author") %}

## License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= license %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
