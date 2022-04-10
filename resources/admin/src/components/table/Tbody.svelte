<script>
  import { Link } from "svelte-navigator";
  import { destroy } from "src/scripts/crud.js";
  import { DoubleBounce } from "svelte-loading-spinners";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let rows;
  export let keys;
  export let routeUrl;
  export let apiUrl;
  export let loading = 0;

  async function del(id) {
    loading = id;
    const del = await destroy(apiUrl, id, "User deleted successfully");
    loading = 0;
    dispatch("delete", { del });
  }
</script>

<tbody>
  {#each JSON.parse(rows) as row}
    <tr>
      {#each keys as key}
        <td>{row[key]}</td>
      {/each}
      <td>
        <Link to="{routeUrl}/{row['id']}" class="btn btn-primary btn-xs"
          ><i class="fa-solid fa-pen " /></Link
        >
        {#if loading == row["id"]}
          <span style="display:inline-block; vertical-align: middle">
            <DoubleBounce size="25" color="#dc3545" unit="px" duration="2s" />
          </span>
        {:else}
          <a
            href={"#"}
            on:click={() => {
              del(row["id"]);
            }}
            class="btn btn-danger btn-xs"
            style="padding: .125rem .4rem;"
            ><i class="fa-solid fa-xmark fa-lg" /></a
          >
        {/if}
      </td>
    </tr>
  {/each}
</tbody>
