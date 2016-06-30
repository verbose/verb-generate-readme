```
Usage: gen <command> [options]

Command: Generator or tasks to run

Examples:

  # run the "foo" generator
  $ gen foo

  # run the "bar" task on generator "foo"
  $ gen foo:bar

  # run multiple tasks on generator "foo"
  $ gen foo:bar,baz,qux

  # run a sub-generator on generator "foo"
  $ gen foo.abc

  # run task "xyz" on sub-generator "foo.abc"
  $ gen foo.abc:xyz

  # run multiple generators, sub-generators, or tasks
  $ gen foo foo.abc foo:bar

  Generate attempts to automatically determine if "foo" is a task or generator.
  If there is a conflict, you can force generate to run generator "foo"
  by specifying a task on the generator. Example: `gen foo:default`
```