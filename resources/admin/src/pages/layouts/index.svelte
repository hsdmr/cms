<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/table/Table.svelte";
  import { route, api } from "src/scripts/links.js";
  
  $: titles = [
    $__("title.name"),
    $__("title.status"),
    $__("title.language"),
  ];

  const keys = [
    "name",
    "status",
    "language",
  ];

  $: title = $__("title.layouts");
  $: links = [{ pageUrl: route.admin, pageTitle: $__("title.dashboard") }];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid layouts">
  <Table
    {titles}
    {keys}
    apiUrl={api.layout}
    routeUrl="/{route.admin}/{route.options}/{route.layouts}"
  />
</div>
