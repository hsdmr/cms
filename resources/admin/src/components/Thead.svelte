<script>
  import { __ } from "src/scripts/i18n.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let titles;
  export let keys;
  export let order;
  export let by;

  let labels = {
    asc: { title: "Ascending", html: "&#8593;" },
    desc: { title: "Desceding", html: "&#8595;" },
    unsorted: { title: "Unsorted", html: "&#8645;" },
  };

  const setOrder = (key) => {
    by = by === "asc" ? "desc" : "asc";
    order = key;
    dispatch("order", { order, by });
  };
</script>

<style>
  .sort {
    cursor: pointer;
    float: right;
    padding: 0 0.25em;
    color: #999;
  }
  th {
    border: 1px solid #dfdfdf;
  }
</style>

<thead>
  <tr>
    {#each titles as title, i}
      <th
        >{title}
        <span
          class="sort"
          on:click={() => {
            setOrder(keys[i]);
          }}
        >
          {#if by === "asc"}
            <span title={labels.asc.title}>
              {@html labels.asc.html}
            </span>
          {:else if by === "desc"}
            <span title={labels.desc.title}>
              {@html labels.desc.html}
            </span>
          {:else}
            <span title={labels.unsorted.title}>
              {@html labels.unsorted.html}
            </span>
          {/if}
        </span>
      </th>
    {/each}
    <th style="width: 100px" />
  </tr>
</thead>
