# {%= name %} {%= badge('npm') %} {%= badge('downloads') %} {%= ifExists(["test", "test.js"], badge('travis')) %}

{%= ifExists('docs/logo.png', include('logo')) %}

{%= section("about", description) %}

{%= include("highlight") %}
