---
layout: nil
---

{%= include("generate/logo") %}
{%= include("generate/header") %}

![{%= name %} demo](https://raw.githubusercontent.com/{%= repo %}/master/docs/demo.gif)

{%= include("toc") %}

{% body %}

## Getting started
### Install
{%= include("generate/generator-install") %}

### CLI
{%= include("generate/generator-run") %}
{%= doc("what-will-happen") %}

**What you should see in the terminal**

If completed successfully, you should see both `starting` and `finished` events in the terminal, like the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).

### Help

To see a general help menu and available commands for {%= platform.proper %}'s CLI, run:

```sh
$ {%= platform.command %} help
```

{%= section('next-steps', include('generate/next-steps')) %}

## About
### What is "Generate"?
{%= include("generate/what-is-generate") %}

### Related projects
{%= section("related", related(verb.related.list)) %}

### Community
{%= include("generate/community") %}

### Contributors
{%= gh.contributors() %}

### Contributing
{%= include("contributing") %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Release history
{%= section("history") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= licenseStatement || (license ? ("Released under the " + license + " License.") : "MIT") %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}

[docs]: https://github.com/generate/generate/blob/master/docs/
