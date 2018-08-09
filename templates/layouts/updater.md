---
layout: nil
---

{%= include("update/logo") %}
{%= include("update/header") %}

{%= include("toc") %}

## What is "Update"?

<details>
  <summary><strong>Details</strong></summary>

{%= include("update/what-is-update") %}

</details>

{% body %}


## About

<details>
  <summary><strong>Contributing</strong></summary>

{%= include("contributing") %}

<details>

<details>
  <summary><strong>Running Tests</strong></summary>

{%= maybeInclude("coverage") %}
{%= include("tests") %}

<details>

### Related projects
You might also find these projects useful.
{%= section("related", related(verb.related.list)) %}

{%= include("update/community") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= licenseStatement || (typeof license !== 'undefined' ? ("Released under the " + license + " License.") : "MIT") %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
