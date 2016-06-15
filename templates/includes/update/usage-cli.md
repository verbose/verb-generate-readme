**Installing the CLI**

To run the `{%= alias %}` updater from the command line, you'll need to install [update][] globally first. You can do that now with the following command:

```sh
$ npm i -g update
```

This adds the `gen` command to your system path, allowing it to be run from any directory. 

**Help**

Get general help and a menu of available commands:

```sh
$ gen help
```

**Running the `{%= alias %}` updater**

Once both [update][] and `{%= name %}` are installed globally, you can run the updater with the following command:

```sh
$ gen {%= alias %}
```

If completed successfully, you should see both `starting` and `finished` events in the terminal, similar to the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).
