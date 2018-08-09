{%= include("details-contributing") %}
{%= include("details-running-tests") %}
{%= include("details-building-docs") %}

### Related projects
{%= section("related", include("related-list")) %}
{%= section("community") %}

### Contributors
{%= ghContributors() %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= before.license ? (before.license + "\n") : "" %}{%= licenseStatement || ("Released under the " + (license || "MIT") + " License.") %}{%= after.license ? (after.license + "\n") : "" %}

***

{%= include("footer") %}

{%= reflinks(verb.reflinks) %}
