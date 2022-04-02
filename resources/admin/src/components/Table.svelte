<script>
  import { __ } from "src/scripts/i18n.js";

  export let titles;
  export let rows;
  export let keys;
</script>

<div class="card">
  <div class="card-header">
    <div class="card-tools">
      <ul class="pagination pagination-sm m-0 float-right">
        <li class="page-item"><a class="page-link" href={"#"}>«</a></li>
        <li class="page-item"><a class="page-link" href={"#"}>1</a></li>
        <li class="page-item"><a class="page-link" href={"#"}>2</a></li>
        <li class="page-item"><a class="page-link" href={"#"}>3</a></li>
        <li class="page-item"><a class="page-link" href={"#"}>»</a></li>
      </ul>
    </div>
    <div class="card-tools float-left">
      <div class="input-group input-group-sm m-0" style="width: 150px;">
        <input
          type="text"
          name="table_search"
          class="form-control float-right"
          placeholder="Search"
        />

        <div class="input-group-append">
          <button type="submit" class="btn btn-default">
            <i class="fas fa-search" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- /.card-header -->
  <div class="card-body p-0">
    <!-- svelte-ignore component-name-lowercase -->
    <table class="table table-sm table-hover table-striped">
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
        {#each JSON.parse(rows) as row, i}
          <tr>
            <td>{i + 1}</td>
            {#each keys as key}
              <td>{row[key]}</td>
            {/each}
            <td>+</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer clearfix">
    <ul class="pagination pagination-sm m-0 float-right">
      <li class="page-item"><a class="page-link" href={"#"}>«</a></li>
      <li class="page-item"><a class="page-link" href={"#"}>1</a></li>
      <li class="page-item"><a class="page-link" href={"#"}>2</a></li>
      <li class="page-item"><a class="page-link" href={"#"}>3</a></li>
      <li class="page-item"><a class="page-link" href={"#"}>»</a></li>
    </ul>
  </div>
  <!-- /.card-body -->
</div>
