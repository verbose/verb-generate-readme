# {%= name %} {%= badge('npm') %} {%= badge('travis') %}

> {%= description %}

{%= include("highlight") %}

<!-- toc -->

## Install
{%= include('install-global') %}

{% body %}

## Related projects
{%= verb.related.description || "" %}
{%= related(verb.related.list) %}

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
