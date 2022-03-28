<script>
  import { Route } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";

  $: title = $__("title.dashboard");
  $: active = title;
  $: links = [];
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid dashboard">
  {$__("title.dashboard")}
</div>
