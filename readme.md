# verb-readme-generator [![NPM version](https://img.shields.io/npm/v/verb-readme-generator.svg?style=flat)](https://www.npmjs.com/package/verb-readme-generator) [![NPM downloads](https://img.shields.io/npm/dm/verb-readme-generator.svg?style=flat)](https://npmjs.org/package/verb-readme-generator) [![Build Status](https://img.shields.io/travis/verbose/verb-readme-generator.svg?style=flat)](https://travis-ci.org/verbose/verb-readme-generator)

Generate your project's readme with verb. Requires verb v0.9.0 or higher.

You might also be interested in [generate](https://github.com/generate/generate).

## Install

Install as a `devDependency` with [npm](https://www.npmjs.com/):

```sh
$ npm install --save-dev verb-readme-generator
```

## Heads up!

This generator requires **verb 0.9.0** and up, which is currently on the `dev` branch. If you're willing to put up with occassional bugs and would like to provide helpful feedback, install verb with the following command:

```sh
$ npm i -g "verbose/verb#dev"
```

## What is verb?

Verb is a powerful, _open-source developer framework and documentation build-system for GitHub projects_.

**API**

Built on node.js, Verb's API is crafted around the purpose of simplifying how documentation is specified, authored, rendered and generated. The core verb application offers methods for rendering templates, working with the file system, registering and running tasks, and verb can be extended to do anything else using plugins.

**CLI**

Once [installed globally](#cli), verb's CLI is run using the `verb` command.

**verbfile.js**

Each time the `verb` command is run, verb's CLI looks for a `verbfile.js` in the user's current working directory and if found will try to load the file and execute any [tasks](#tasks) specified by the user.

**.verb.md**

If `verb-readme-generator` is installed (locally or globally), and a `verbfile.js` is not found, verb's CLI looks for a `.verb.md` readme template in the user's current working directory. If found, verb will render the file to create a `README.md` using data from the user's environment, such as `package.json` and `.git` config (for username, if necessary).

Visit the [verb](https://github.com/verbose/verb) project to learn more.

## CLI

**Installing the CLI**

To run the `readme` generator from the command line, you'll need to install [verb](https://github.com/verbose/verb) globally first. You can that now with the following command:

```sh
$ npm install --global verb
```

This adds the `verb` command to your system path, allowing it to be run from any directory. Visit the [verb](https://github.com/verbose/verb) project and documentation to learn more.

**Run the `readme` generator from the command line**

Once both [verb](https://github.com/verbose/verb) and `verb-readme-generator` are installed globally, you can run the generator with the following command:

Run the `readme` generator from the command line:

```sh
$ verb readme
```

## Tasks

The following tasks are defined on the generator.

### [data](generator.js#L108)

Loads data to used for rendering templates. Called by the [readme](#readme) task.

**Example**

```sh
$ verb readme:data
```

### [new](generator.js#L168)

Add a `.verb.md` template to the current working directory.

**Example**

```sh
$ verb readme:new
```

### [verbmd](generator.js#L193)

Load the `.verb.md` in the user's current working directory. If no `.verb.md` file exists, the [prompt-verbmd)() task is called to ask the user if they want to add the file. Disable the prompt by passing `--verbmd=false` on the command line, or `app.disable('verbmd')` via API.

**Example**

```sh
$ verb readme:verbmd
```

### [prompt-verbmd](generator.js#L222)

Prompts the user to add a new `.verb.md` template to the current working directory. Useful in sub-generators.

**Example**

```sh
$ verb readme:prompt-verbmd
```

### [ask](generator.js#L248)

User-friendly alias for the [prompt-verbmd](#prompt-verbmd) task. _(This task is aliased with both a terse and long-form name so that in the case this generator is inherited by another and the generator already has an `ask` task, the `prompt-verbmd` task will still be available to use via API.)_

**Example**

```sh
$ verb readme:ask
```

### [templates](generator.js#L260)

Load layouts, includes and badges commonly used for generating a README.md.

**Example**

```sh
$ verb readme:templates
```

### [setup](generator.js#L313)

Load `options`, `plugins`, `middleware` and `data` before calling a task to render templats.

**Example**

```sh
$ verb readme:setup
```

### [readme](generator.js#L326)

Generate a README.md from a `.verb.md` template. Runs the [middleware](#middleware), [templates](#templates), and [data](#data) tasks. This is a [verb](#verb/docs/tasks/#silent) task.

**Example**

```sh
$ verb readme
```

### [default](generator.js#L365)

Alias for the [readme](#readme) task, generates a README.md to the user's working directory.

**Example**

```sh
$ verb readme
```

## Options

Configuration options can be passed on the command line, defined on the `verb` object in package.json, or set using the API.

Most of the following examples show how to set configuration values on the `verb` object _via the command line_, but you can also set these manually.

### run

To automatically run the `readme` generator with the `verb` command (without specifying `readme` on the command line), add the following to package.json:

```js
// --package.json--
{
  // add a verb object with an array of tasks to run
  "verb": {
    "tasks": ["readme"]
  }
}
```

### silent

Mute progress for tasks and generators from being displayed in the terminal.

**CLI**

```sh
$ verb --silent
```

**verb config**

In your project's package.json:

```json
{
  "verb": {
    "silent": true
  }
}
```

**API**

In your `verbfile.js` or application code:

```js
app.enable('silent');

// equivalent to
app.option('silent', true);
```

**Examples**

![running tasks and generators](https://cloud.githubusercontent.com/assets/383994/14978816/7449a5c6-10ec-11e6-9bac-07e482e915f2.gif)

With `--silent`

![running tasks and generators with the silent flag](https://cloud.githubusercontent.com/assets/383994/14979276/573b5f8a-10ef-11e6-8ce4-6c5bc4563f6b.png)

### readme

Customize the location of your readme template.

**CLI**

```sh
$ verb --readme="lib/foo.md"
```

**verb config**

In your project's package.json:

```json
{
  "verb": {
    "readme": "docs/foo.md"
  }
}
```

### times

Display all timings that are typically muted in the terminal.

**CLI**

```sh
$ verb --times
```

**verb config**

Always show timings for a project by adding the following to package.json:

```json
{
  "verb": {
    "times": true
  }
}
```

**API**

In your `verbfile.js` or application code:

```js
app.enable('times');
// equivalent to
app.option('times', true);
```

### toc

Disable or enable the Table of Contents in the built-in layouts:

**CLI**

One-time only (in-memory)

```sh
# enable
$ verb --toc
# disable
$ verb --toc:false
```

Persist the value to package.json:

```sh
# enable
$ verb --config=toc
# disable
$ verb --config=toc:false
```

Results in:

```json
{
  "name": "my-project",
  "verb": {
    "toc": false
  }
}
```

#### layout

Set the layout to use for a project.

```sh
$ verb --config=layout:default
```

**Available layouts**

As with all templates, you can easily override these and/or define your own templates in a `verbfile.js`. Verb does much more than generate readme's!

The following layouts are available:

* `default`: a layout with installation, tests, author, usage, related list, contributing and license sections.
* `global`: same as default, but with global npm installation instructions (verb-readme-generator uses this layout)
* `empty`: noop layout. no content is applied, but all layout-related middleware stages will still run.

Layouts can be defined on a template-by-template basic, and even for includes. If you need more granularity just add a `verbfile.js` with your custom code.

## Related projects

You might also be interested in these projects:

* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://github.com/verbose/verb) | [homepage](https://github.com/verbose/verb "Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used on hundreds of projects of all sizes to generate everything from API docs to readmes.")
* [verb-collections](https://www.npmjs.com/package/verb-collections): Verb plugin that adds includes, layouts, badges and docs template collections. Can be used with… [more](https://github.com/verbose/verb-collections) | [homepage](https://github.com/verbose/verb-collections "Verb plugin that adds includes, layouts, badges and docs template collections. Can be used with verb, assemble or generate, in a `*file.js`, or a globally installed generator.")
* [verb-data](https://www.npmjs.com/package/verb-data): Verb plugin that adds commonly needed data to the context for rendering templates. | [homepage](https://github.com/jonschlinkert/verb-data "Verb plugin that adds commonly needed data to the context for rendering templates.")
* [verb-toc](https://www.npmjs.com/package/verb-toc): Verb plugin that adds middleware for creating and injecting a table of contents into a… [more](https://github.com/verbose/verb-toc) | [homepage](https://github.com/verbose/verb-toc "Verb plugin that adds middleware for creating and injecting a table of contents into a markdown document.")

## Contributing

This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Or visit the [verb-readme-generator](https://github.com/verbose/verb-readme-generator) project to submit bug reports or pull requests for the readme layout template.

## Building docs

_(This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/verbose/verb-readme-generator/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 06, 2016._