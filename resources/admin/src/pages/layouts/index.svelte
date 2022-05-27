<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/table/Table.svelte";
  import { route, api } from "src/scripts/links.js";

  $: titles = [$__("any.title"), $__("any.status"), $__("any.language")];

  const keys = ["title", "status", "language"];

  $: title = $__("any.layouts");
  $: links = [{ pageUrl: route.admin, pageTitle: $__("any.dashboard") }];
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
