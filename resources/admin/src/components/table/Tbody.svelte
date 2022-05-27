<script>
  import { __ } from "src/scripts/i18n.js";
  import { Link } from "svelte-navigator";
  import { destroy, restore } from "src/scripts/crud.js";
  import { Circle } from "svelte-loading-spinners";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let rows;
  export let keys;
  export let routeUrl;
  export let apiUrl;
  export let trash;
  export let trashButton;
  export let loading = false;

  async function res(id) {
    loading = id + "restore";
    const res = await restore(apiUrl, id, $__("notify.restoredSuccessfully"));
    loading = 0;

    if (res) {
      dispatch("restore", { res });
    }
  }

  async function del(id, permanent = false) {
    loading = id + "del";
    const del = await destroy(
      apiUrl,
      id,
      permanent,
      $__("notify.deletedSuccessfully", { title: "" })
    );
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
        {$__("any.noElementFound")}
      </td>
    </tr>
  {/if}
  {#each rows as row}
    <tr>
      {#each keys as key}
        <td>{parseValue(row[key])}</td>
      {/each}
      <td>
        {#if trash}
          {#if loading == row["id"] + "restore"}
            <span style="display:inline-block; vertical-align: middle">
              <Circle size="25" color="var(--info)" unit="px" duration="2s" />
            </span>
          {:else}
            <a
              href={"#"}
              on:click={() => {
                res(row["id"]);
              }}
              class="btn btn-info btn-xs"
              title={$__("any.restore")}
              ><i class="fa-solid fa-recycle fa-lg" /></a
            >
          {/if}
          {#if loading == row["id"] + "permanentDelete"}
            <span style="display:inline-block; vertical-align: middle">
              <Circle size="25" color="var(--danger)" unit="px" duration="2s" />
            </span>
          {:else}
            <a
              href={"#"}
              on:click={() => {
                del(row["id"], true);
              }}
              title={$__("any.deletePermanently")}
              class="btn btn-danger btn-xs"
              style="padding: .125rem .4rem;"
              ><i class="fa-solid fa-xmark fa-lg" /></a
            >
          {/if}
        {:else}
          <Link
            to="{routeUrl}/{row['id']}"
            class="btn btn-primary btn-xs"
            title={$__("any.edit")}><i class="fa-solid fa-pen " /></Link
          >
          {#if loading == row["id"] + "del"}
            <span style="display:inline-block; vertical-align: middle">
              <Circle size="25" color="var(--danger)" unit="px" duration="2s" />
            </span>
          {:else if trashButton}
            <a
              href={"#"}
              on:click={() => {
                del(row["id"]);
              }}
              title={$__("any.moveToTrash")}
              class="btn btn-danger btn-xs"
              style="padding: .125rem .3rem;"
              ><i class="fa-solid fa-trash-can" /></a
            >
          {:else}
            <a
              href={"#"}
              on:click={() => {
                del(row["id"]);
              }}
              title={$__("any.deletePermanently")}
              class="btn btn-danger btn-xs"
              style="padding: .125rem .4rem;"
              ><i class="fa-solid fa-xmark fa-lg" /></a
            >
          {/if}
        {/if}
      </td>
    </tr>
  {/each}
</tbody>
