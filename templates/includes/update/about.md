Update is a new, open-source developer framework for automating updates of any kind to code projects.

## Quick start

**API**

Create tasks for things you'd rather not do manually (or more than once), like updating copyright years:

```js
var update = require('update');
var app = update();

app.task('copyright', function() {
  return app.src('*')
});
```

**CLI**

Use [update's CLI](#cli) to run [tasks](#tasks) and [updaters](#updaters). For example, to run the copyright task from the previous example, you would run:

```sh
$ update copyright
```


## What does it do?

> Update is the assistant who takes care of the timewasters in a project, so you can focus on doing what you love: writing code

From time to time we all neglect things in a project, either because they are tedious or time consuming, or just less important than other things that need to get done. Like:

- updating the year in copyright statements (in banners, readme, license files, etc)
- adding missing dotfiles, or linting and updating them to reflect your latest prefences or changes in conventions
- updating config files, like `package.json`, by fixing incorrect fields, removing deprecated fields, or adding missing fields

Regardless of our intentions, some things are neglected, some overlooked, some ignored. This is magnified with unstructured data, or things that can't be unit tested.

## How does it work?

Update is not a build system, but it looks like one from 2,000 feet.


- powerful control flow, with [tasks](#tasks) and [updaters](#updaters)


**Tasks**

Update uses some of the same libraries that power [gulp][]. If you're familiar with [gulp][], then you're already familiar with how tasks work in update.
