---
layout: nil
---

{%= include("header") %}

{% if (obj.verb.toc === "collapsible") { %}
<details>
<summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>
{% } else { %}
## Table of Contents
<!-- toc -->
{% } %}

{% body %}

## About
{%= include("about") %}
