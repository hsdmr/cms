<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { checkAuth } from "src/scripts/auth.js";
  import { onMount } from "svelte";
  import { route } from "src/scripts/links.js";
  
  $: title = $__("title.layouts");
  $: links = [{ pageUrl: route.admin, pageTitle: $__("title.dashboard") }];
  onMount(checkAuth);
</script>

<Breadcrump {title} {links} />
<div class="container-fluid layouts">
  {$__("title.layouts")}
</div>
