<script>
  import { __ } from "src/scripts/i18n.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  
  export let search;

  const onSearch = () => {
    dispatch("search", { search });
  };
</script>

<div class="input-group input-group-sm m-0 float-right" style="width: 300px;">
  <input
    type="text"
    name="table_search"
    class="form-control float-right"
    placeholder={$__("any.search")}
    bind:value={search}
  />

  <div class="input-group-append">
    <button type="submit" class="btn btn-default" on:click={onSearch}>
      <i class="fas fa-search" />
    </button>
  </div>
</div>
