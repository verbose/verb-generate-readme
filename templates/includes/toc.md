{% if (obj.verb.toc && (obj.verb.toc === "collapsible" || typeof obj.verb.toc === 'object' && obj.verb.toc.collapsible === true)) { %}
## Table of Contents

<details>
<summary><strong>Details</strong></summary>

<!-- toc -->

</details>
{% } else { %}

<!-- toc -->

{% } %}
