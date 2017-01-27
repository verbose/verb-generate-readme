---
layout: nil
---

{%= include("header") %}

## Install
{%= include("install-npm", {save: true}) %}

{% body %}

## Author
{%= include("author") %}

## License
{%= copyright({linkify: true}) %}
{%= licenseStatement || (license ? ("Released under the " + license + " License.") : "MIT") %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
