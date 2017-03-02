---
layout: nil
---

{%= section("header") %}
{%= ifExists(["docs/demo.gif", "demo.gif"], section("demo.md")) %}
{%= ifExists("example.gif", section("example.md")) %}
{%= include("toc") %}

{% body %}

## About
### Related projects
{%= section("related", related(verb.related.list)) %}

{%= section("community") %}

### Contributing
{%= include("contributing") %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= licenseStatement || ("Released under the " + (license || "MIT") + " License.") %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
