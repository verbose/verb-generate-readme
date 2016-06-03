**Installing the CLI**

To run the `{%= alias %}` generator from the command line, you'll need to install [generate][] globally first. You can do that now with the following command:

```sh
$ npm i -g generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory. 

**Help**

Get general help and a menu of available commands:

```sh
$ gen help
```

**Running the `{%= alias %}` generator**

Once both [generate][] and `{%= name %}` are installed globally, you can run the generator with the following command:

```sh
$ gen {%= alias %}
```

If completed successfully, you should see both `starting` and `finished` events in the terminal, like the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).
