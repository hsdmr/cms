<script>
  import { Link } from "svelte-navigator";

  export let title;
  export let links;
  export let active;
</script>

<div class="content-header">
  <div class="container-fluid">
    <div class="row mb-2">
      <div class="col-sm-6">
        <h1 class="m-0">{title}</h1>
      </div>
      <!-- /.col -->
      <div class="col-sm-6">
        <ol class="breadcrumb float-sm-right">
          {#each links as item}
            <li class="breadcrumb-item">
              <Link to="/{item.pageUrl}">{item.pageTitle}</Link>
            </li>
          {/each}
          <li class="breadcrumb-item active">{active}</li>
        </ol>
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->
  </div>
  <!-- /.container-fluid -->
</div>
