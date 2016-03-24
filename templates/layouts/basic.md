# {%= name %} {%= badge('npm') %} {%= badge('downloads') %} {%= badge('travis') %}

> {%= description %}

{%= include("highlight") %}

## TOC
<!-- toc -->

## Install
{%= include('install-npm', {save: true}) %}

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
{%= copyright({linkify: true}) %}
{%= license %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
