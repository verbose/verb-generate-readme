{% if (obj.verb.toc && (obj.verb.toc === "collapsible" || typeof obj.verb.toc === 'object' && obj.verb.toc.collapsible === true)) { %}
<details>
<summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>
{% } else { %}
## Table of Contents
<!-- toc -->
{% } %}
