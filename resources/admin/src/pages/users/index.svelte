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

  async function getUsers() {
    await checkAuth();
    const auth = getSessionItem("auth");

    const res = await fetch(api.user, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Authorization": auth.access_token,
      },
    });
    console.log(res.response.json());
    const response = await res.response.json();

    if (typeof response.access_token === "undefined") {
      if (typeof response.message !== "undefined") {
        toastr.error(response.message);
      }
      navigate("/" + route.login);
    }

    if (res.ok) {
      return response;
    } else {
      throw new Error(response);
    }
  }

  let promise = getUsers();

  function handleClick() {
    promise = getUsers();
  }

  const titles = [
    $__("title.firstName"),
    $__("title.lastName"),
    $__("title.role"),
    $__("title.email"),
    $__("title.username"),
    $__("title.nickname"),
  ];

  const keys = [
    "firs_name",
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
  {:then response}
    {promise}
    {response}
    <Table {titles} {keys} rows={response} />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
