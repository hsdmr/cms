<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/table/Table.svelte";
  import { api } from "src/scripts/links.js";
  import { route } from "src/scripts/links.js";


  $: titles = [
    $__("any.firstName"),
    $__("any.lastName"),
    $__("any.role"),
    $__("any.email"),
    $__("any.username"),
    $__("any.nickname"),
  ];

  const keys = [
    "first_name",
    "last_name",
    "role",
    "email",
    "username",
    "nickname",
  ];
  
  $: title = $__("any.users");
  $: links = [{ pageUrl: route.admin, pageTitle: $__("any.dashboard") }];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid users">
  <Table
    {titles}
    {keys}
    apiUrl={api.user}
    routeUrl="/{route.admin}/{route.users}"
  />
</div>
