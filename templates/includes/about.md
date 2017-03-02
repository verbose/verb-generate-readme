### Related projects
{%= section("related", related(verb.related.list)) %}

{%= section("community") %}

### Contributing
{%= include("contributing") %}

### Contributors
{%= gh.contributors() %}

### Release history
{%= section("history") %}

### Building docs
{%= include("build-docs") %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= before.license ? (before.license + "\n") : "" %}{%= licenseStatement || ("Released under the " + (license || "MIT") + " License.") %}{%= after.license ? (after.license + "\n") : "" %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
