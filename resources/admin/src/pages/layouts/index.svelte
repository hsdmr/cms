<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { checkAuth } from "src/scripts/auth.js";
  import { onMount } from "svelte";
  onMount(checkAuth);

  $: title = $__("title.layouts");
  $: active = title;
  $: links = [{ pageUrl: "admin", pageTitle: $__("title.dashboard") }];
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid layouts">
  {$__("title.layouts")}
</div>
