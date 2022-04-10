<script>
  import { __ } from "src/scripts/i18n.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  
  export let search;
  export let color;

  const onSearch = () => {
    dispatch("search", { search });
  };
</script>

<div class="input-group input-group-sm flaot-right" style="width: 300px;">
  <input
    type="text"
    name="table_search"
    class="form-control"
    placeholder={$__("any.search")}
    bind:value={search}
  />

  <div class="input-group-append">
    <button type="submit" class="btn btn-{color}" on:click={onSearch}>
      <i class="fas fa-search" />
    </button>
  </div>
</div>
