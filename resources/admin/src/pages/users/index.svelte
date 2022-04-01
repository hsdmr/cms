<script>
  import { __ } from "src/scripts/i18n.js";
  import { table } from "src/scripts/translate.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import Table from "src/components/Table.svelte";

  $: title = $__("title.users");
  $: active = title;
  $: links = [{ pageUrl: "admin", pageTitle: $__("title.dashboard") }];

  async function getRandomNumber() {
    const res = await fetch(`/tutorial/random-number`);
    const text = await res.text();

    if (res.ok) {
      return text;
    } else {
      throw new Error(text);
    }
  }

  let promise = getRandomNumber();

  function handleClick() {
    promise = getRandomNumber();
  }

  const titles = [
    $__(table.firstName),
    $__(table.lastName),
    $__(table.role),
    $__(table.email),
    $__(table.username),
    $__(table.nickname),
  ];

  const keys = [
    'firs_name',
    'last_name',
    'role',
    'email',
    'username',
    'nickname',
  ]
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid users">
  <Table />
</div>
