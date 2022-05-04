<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/table/Table.svelte";
  import { route, api } from "src/scripts/links.js";
  
  $: titles = [
    $__("any.title"),
    $__("title.status"),
    $__("title.language"),
  ];

  const keys = [
    "title",
    "status",
    "language",
  ];

  $: title = $__("title.trash");
  $: links = [
    { pageUrl: route.admin, pageTitle: $__("title.dashboard") },
    { pageUrl: route.admin + "/" + route.options + "/" + route.layouts, pageTitle: $__("title.layouts") },
  ];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid layouts">
  <Table
    {titles}
    {keys}
    apiUrl={api.layout}
    routeUrl="/{route.admin}/{route.options}/{route.layouts}"
    addNewButton={false}
    trashButton={false}
    currentPage="trash"
  />
</div>
