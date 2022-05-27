<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/table/Table.svelte";
  import { api } from "src/scripts/links.js";
  import { route } from "src/scripts/links.js";

  $: titles = [$__("any.role"), $__("any.updatedAt")];

  const keys = ["role", "updated_at"];

  $: title = $__("any.roles");
  $: links = [{ pageUrl: route.admin, pageTitle: $__("any.dashboard") }];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid users">
  <Table
    {titles}
    {keys}
    trashButton={false}
    apiUrl={api.role}
    routeUrl="/{route.admin}/{route.roles}"
  />
</div>
