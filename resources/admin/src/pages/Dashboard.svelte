<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { onMount } from "svelte";
  import { checkAuth } from "src/scripts/auth.js";
  onMount(checkAuth);
  $: title = $__("title.dashboard");
  $: active = title;
  $: links = [];
  
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid dashboard">
  {$__("title.dashboard")}
</div>
