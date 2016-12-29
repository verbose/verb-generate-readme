# {%= name %} {%= badge('npm') %} {%= badge('npm-downloads-monthly') %}  {%= badge('npm-downloads-total') %} {%= ifExists(["test", "test.js"], badge('travisLinus')) %} {%= ifExists("appveyor.yml", badge('appveyor')) %}

> {%= description %}

{%= include("highlight") %}
