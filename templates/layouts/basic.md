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
{%= license %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
