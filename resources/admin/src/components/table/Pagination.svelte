<script>
  import { __ } from "src/scripts/i18n.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let page;
  export let total;
  export let limit;
  export let color;

  $: totalPage = Math.ceil(total / limit);

  const setPage = (number) => {
    page = number;
    dispatch("page", { page });
  };
</script>

{#if totalPage > 1}
  <ul class="pagination pagination-sm m-0 float-right">
    <li class="page-item">
      {#if page === 1}
        <button
          type="button"
          class="page-link"
          style="background-color: whitesmoke;"
          disabled>«</button
        >
      {:else}
        <button
          type="button"
          class="page-link"
          on:click={() => {
            setPage(page - 1);
          }}>«</button
        >
      {/if}
    </li>
    {#each Array(totalPage + 1) as _, i}
      {#if i > 0}
        {#if i === page}
          <li class="page-item">
            <button type="button" class="page-link bg-{color}" disabled
              >{i}</button
            >
          </li>
        {:else}
          <li class="page-item">
            <button
              type="button"
              class="page-link"
              on:click={() => {
                setPage(i);
              }}>{i}</button
            >
          </li>
        {/if}
      {/if}
    {/each}
    <li class="page-item">
      {#if page === totalPage}
        <button
          type="button"
          class="page-link"
          style="background-color: whitesmoke;"
          disabled>»</button
        >
      {:else}
        <button
          type="button"
          class="page-link"
          on:click={() => {
            setPage(page + 1);
          }}>»</button
        >
      {/if}
    </li>
  </ul>
{/if}
