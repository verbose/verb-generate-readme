# Helpers

TODO

## toc

Generate a table of contents for the current document:

```js
{%%= toc() %}
```

Generate a table of contents for the specified string:

```js
{%%= toc(read('foo.md')) %}
```

### toc options

**Filter headings**

```js
{%%= toc({filter: /^options\w+/}) %}
{%%= toc({filter: "foo.*"}) %}
{%%= toc({filter: "*.bar"}) %}
```
