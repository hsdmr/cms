<script>
  export let rows;
  export let keys;
</script>


<tbody>
  {#each JSON.parse(rows) as row}
    <tr>
      {#each keys as key}
        <td>{row[key]}</td>
      {/each}
      <td>
        <a href={"#"} class="btn btn-primary btn-xs"
          ><i class="fa-solid fa-pen " /></a
        >
        <a
          href={"#"}
          class="btn btn-danger btn-xs"
          style="padding: .125rem .4rem;"
          ><i class="fa-solid fa-xmark fa-lg" /></a
        >
      </td>
    </tr>
  {/each}
</tbody>