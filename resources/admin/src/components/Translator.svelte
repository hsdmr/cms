<script>
  import translations from "src/scripts/translate.js";
  import { dict } from "src/scripts/i18n.js";

  $: dict.set(translations);
</script>

<slot />
