<script>
  import { __ } from "src/scripts/i18n.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const limits = [10, 25, 50, 100];

  export let limit;

  const setLimit = () => {
    dispatch("limit", { limit });
  };
</script>

<div class="float-left">
  <p style="width:100px" class="d-inline">{$__("any.shownRecord")}</p>
  <select
    bind:value={limit}
    on:change={setLimit}
    class="form-control form-control-sm d-inline mx-2"
    style="width:65px;"
    >{#each limits as item}
      <option value={item}>{item}</option>
    {/each}
  </select>
</div>
