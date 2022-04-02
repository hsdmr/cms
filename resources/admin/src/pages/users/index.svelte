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

  let promise;

  //async function getUsers() {
  //  loading = true;
  //  await checkAuth();
  //  const auth = getSessionItem("auth");
  //
  //  const res = await fetch(api.user, {
  //    method: "GET",
  //    headers: {
  //      "Content-Type": "application/json",
  //      Accept: "application/json",
  //      Authorization: auth.access_token,
  //    },
  //  })
  //    .then((response) => {
  //      if (!response.ok) {
  //        console.error(`HTTP error: ${response.status}`);
  //      }
  //      return response.json();
  //    })
  //    .then((user) => {
  //      if (typeof user.message !== "undefined") {
  //        toastr.error(response.message);
  //        navigate("/" + route.login);
  //      }
  //      loading = false;
  //      users = user;
  //      return user;
  //    })
  //    .catch((err) => console.error(`Fetch problem: ${err.message}`));
  //}

  async function getUsers() {
    loading = true;
    await checkAuth();
    const auth = getSessionItem("auth");

    const res = await fetch(api.user, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth.access_token,
      },
    });
    const response = await res.text();

    if (res.ok) {
      return response;
    } else {
      throw new Error(response);
    }
  }

  promise = getUsers();

  function handleClick() {
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
    <Table {titles} {keys} rows={users} />
  {/await}
</div>
