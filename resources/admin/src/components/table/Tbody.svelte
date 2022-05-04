<script>
  import { __ } from "src/scripts/i18n.js";
  import { Link } from "svelte-navigator";
  import { destroy } from "src/scripts/crud.js";
  import { Circle } from "svelte-loading-spinners";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let rows;
  export let keys;
  export let routeUrl;
  export let apiUrl;
  export let loading = false;

  async function del(id) {
    loading = id;
    const del = await destroy(apiUrl, id, $__("notify.deletedSuccessfully"));
    loading = 0;

    if (del) {
      dispatch("delete", { del });
    }
  }

  const parseValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    } else {
      return value;
    }
  };
</script>

<tbody>
  {#if rows.length == 0}
  <tr>
    <td class="text-center" colspan={keys.length + 1}>
      {$__('any.noElementFound')}
    </td>
  </tr>
    
  {/if}
  {#each rows as row}
    <tr>
      {#each keys as key}
        <td>{parseValue(row[key])}</td>
      {/each}
      <td>
        <Link to="{routeUrl}/{row['id']}" class="btn btn-primary btn-xs"
          ><i class="fa-solid fa-pen " /></Link
        >
        {#if loading == row["id"]}
          <span style="display:inline-block; vertical-align: middle">
            <Circle size="25" color="var(--danger)" unit="px" duration="2s" />
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
