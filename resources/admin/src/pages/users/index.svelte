<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { getSessionItem } from "src/scripts/session.js";
  import Table from "src/components/Table.svelte";
  import { api } from "src/scripts/links.js";
  import { checkAuth } from "src/scripts/auth.js";

  $: title = $__("title.users");
  $: active = title;
  $: links = [{ pageUrl: "admin", pageTitle: $__("title.dashboard") }];

  $: loading = true;
  $: users = [];
  $: search = '';
  $: total = 0;
  $: limit = 10;
  $: page = 1;
  $: order = 'id';
  $: by = 'asc';

  let promise;

  async function getUsers() {
    loading = true;
    await checkAuth();
    const auth = getSessionItem("auth");

    const res = await fetch(api.user + `?search=${search}&page=${page}&limit=${limit}&order=${order}&by=${by}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth.access_token,
      },
    });
    const response = await res.text();
    total = res.headers.get('Total-Row');

    if (res.ok) {
      return response;
    } else {
      throw new Error(response);
    }
  }

  promise = getUsers();

  function whenSearch(event) {
    search = event.detail.search;
    total = event.detail.total;
    limit = event.detail.limit;
    page = event.detail.page;
    order = event.detail.order;
    by = event.detail.by;
    promise = getUsers();
  }

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
  {#await promise}
    <p>...waiting</p>
  {:then users}
    <Table {titles} {keys} {total} {page} {search} {limit} {order} {by} rows={users} on:searchParams={whenSearch}>
    
    </Table>
  {/await}
</div>
