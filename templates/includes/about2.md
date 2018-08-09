
### Related projects
You might also find these projects useful.
{%= section("related", related(verb.related.list)) %}

### Community
{%= include("update/community") %}

### Contributing
{%= include("contributing") %}

### Contributors
{%= ghContributors() %}

### Running tests
{%= maybeInclude("coverage") %}
{%= include("tests") %}

### Author
{%= includeEither("authors", "author") %}

### License
{%= copyright({linkify: true, prefix: "Copyright", symbol: "©"}) %}
{%= licenseStatement || (typeof license !== 'undefined' ? ("Released under the " + license + " License.") : "MIT") %}
