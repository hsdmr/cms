<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";

  $: title = $__("title.users");
  $: active = title;
  $: links = [{ pageUrl: "admin", pageTitle: $__("title.dashboard") }];
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid users">
  {$__("title.users")}
</div>
