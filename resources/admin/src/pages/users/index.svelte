<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/Table.svelte";
  import { api } from "src/scripts/links.js";
  import { Link } from "svelte-navigator";
  import { route } from "src/scripts/links.js";

  $: title = $__("title.users");
  $: active = title;
  $: links = [{ pageUrl: "admin", pageTitle: $__("title.dashboard") }];

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
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid users">
  <div class="card">
    <div class="card-header">
      <Link to="/{route.admin}/{route.users}/{route.new}" class="btn btn-success">
        {$__("any.addNew")}
      </Link>
    </div>
  </div>
  <Table {titles} {keys} apiUrl={api.user} routeUrl="/{route.admin}/{route.users}" />
</div>
