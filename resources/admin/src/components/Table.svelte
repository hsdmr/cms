<script>
  import { __ } from "src/scripts/i18n.js";

  export let titles;
  export let rows;
  export let keys;
</script>

<div class="card">
  <div class="card-header">
    <h3 class="card-title">Condensed Full Width Table</h3>
  </div>
  <!-- /.card-header -->
  <div class="card-body p-0">
    <!-- svelte-ignore component-name-lowercase -->
    <table class="table table-sm">
      <thead>
        <tr>
          <th style="width: 10px">#</th>
          {#each titles as title}
            <th>{title}</th>
          {/each}
          <th style="width: 40px" />
        </tr>
      </thead>
      <tbody>
        {#each rows as row, i}
        <tr>
          <td>{i + 1}</td>
          {#each row as item}
            <td>{item}</td>
          {/each}
          <td></td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <!-- /.card-body -->
</div>
