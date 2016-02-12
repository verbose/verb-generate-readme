# {%= name %} {%= badge('npm') %} {%= badge('travis') %}

> {%= description %}

{%= include("highlight") %}

## TOC
<!-- toc -->

## Install
{%= include('install-npm', {save: true}) %}

{% body %}

## Related projects
{%= verb.related.description || "" %}
{%= related(verb.related.list) %}

## Generate docs
{%= include("generate-docs") %}

## Running tests
{%= include("tests") %}

## Contributing
{%= include("contributing") %}

## Author
{%= include("author") %}

## License
{%= copyright({linkify: true}) %}
{%= license %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
