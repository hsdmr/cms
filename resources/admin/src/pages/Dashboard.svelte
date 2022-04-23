<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { onMount } from "svelte";
  import { checkAuth } from "src/scripts/auth.js";
  
  $: title = $__("title.dashboard");
  $: links = [];
  onMount(checkAuth);
</script>

<Breadcrump {title} {links} />
<div class="container-fluid dashboard">
  {$__("title.dashboard")}
  <p>
    {$__("title.dene",{var: 10})}
  </p>
</div>
