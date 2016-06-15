## Collections

{%= name %} adds the following templates collections to verb (if they don't already exist).

- [layouts](#layouts)
- [files](#files)
- [includes](#includes)
- [docs](#docs)


### layouts

**Type**: `layout`

**Description**

The `layouts` collection is used for caching layout templates. 

**Defining a layout**

Specify the layout to use on the `verb.layout` property in package.json. Example:

```json
{
  "name": "my-project",
  "verb": {
    "layout": "default"
  }
}
```

**Available templates**

The following `layout` templates are included in `{%= name %}`:

{%= list(layouts()) %}

**Overriding templates**


### files

**Type**: `renderable`

**Description**




### includes

**Type**: `include`

**Description**



### docs

**Type**: `include`

**Description**

