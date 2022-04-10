<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/table/Table.svelte";
  import { api } from "src/scripts/links.js";
  import { route } from "src/scripts/links.js";

  $: titles = [
    $__("title.firstName"),
    $__("title.lastName"),
    $__("title.role"),
    $__("title.email"),
    $__("title.username"),
    $__("title.nickname"),
  ];

  const keys = [
    "first_name",
    "last_name",
    "role",
    "email",
    "username",
    "nickname",
  ];

  $: title = $__("title.trash");
  $: links = [
    { pageUrl: route.admin, pageTitle: $__("title.dashboard") },
    { pageUrl: route.admin + "/" + route.users, pageTitle: $__("title.users") },
  ];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid users">
  <Table
    {titles}
    {keys}
    apiUrl={api.user}
    routeUrl="/{route.admin}/{route.users}"
    addNewButton={false}
    trashButton={false}
    currentPage="trash"
  />
</div>
