---
layout: nil
---

{%= include("header") %}

## Table of Contents
{%% console.log(obj) %}

{% if (obj.verb.toc === "collapsible") { %}
<details>
<summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>
{% } else { %}
<!-- toc -->
{% } %}

{% body %}

## About
{%= include("about") %}
