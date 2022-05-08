<script>
  import { __ } from "src/scripts/i18n.js";
  import { checkAuth } from "src/scripts/auth.js";
  import Limit from "src/components/table/Limit.svelte";
  import Pagination from "src/components/table/Pagination.svelte";
  import Search from "src/components/table/Search.svelte";
  import Tbody from "src/components/table/Tbody.svelte";
  import Thead from "src/components/table/Thead.svelte";
  import { Link } from "svelte-navigator";
  import { route } from "src/scripts/links.js";
  import { search } from "src/scripts/crud.js";
  import { Clock } from "svelte-loading-spinners";

  export let titles;
  export let keys;
  export let apiUrl;
  export let routeUrl;
  export let currentPage = "index";
  export let searchBar = true;
  export let addNewButton = true;
  export let trashButton = true;
  let color;

  $: searchData = "";
  $: total = 0;
  $: limit = 10;
  $: page = 1;
  $: order = "id";
  $: by = "asc";
  $: trash = currentPage == "index" ? false : true;

  if (currentPage == "index") {
    color = "info";
  } else if (currentPage == "trash") {
    color = "warning";
  }

  let promise;

  async function getData() {
    await checkAuth();

    const res = await search(
      apiUrl +
        `?search=${searchData}&page=${page}&limit=${limit}&order=${order}&by=${by}&trash=${trash}`
    );

    total = res.total;
    console.log(res.data, total);

    return res.data;
  }

  promise = getData();

  const setOrder = (event) => {
    by = event.detail.by;
    order = event.detail.order;
    console.log(order);
    console.log(by);
    promise = getData();
  };

  const setSearch = (event) => {
    searchData = event.detail.searchData;
    console.log(searchData);
    promise = getData();
  };

  const setLimit = (event) => {
    limit = event.detail.limit;
    console.log(limit);
    promise = getData();
  };

  const setPage = (event) => {
    page = event.detail.page;
    console.log(page);
    promise = getData();
  };

  const setPromise = (event) => {
    promise = getData();
  };
</script>

<div class="card card-outline card-{color}">
  <div class="card-header">
    <div class="row">
      <div class="col-sm-3">
        {#if searchBar}
          <Search {searchData} on:searchData={setSearch} {color} />
        {/if}
      </div>
      <div class="col-sm-9">
        {#if trashButton}
          <Link
            to="/{routeUrl}/{route.trash}"
            class="btn btn-warning btn-sm float-right ml-2"
            ><i class="fa-solid fa-trash" />
            {$__("any.trash")}
          </Link>
        {/if}
        {#if addNewButton}
          <Link
            to="/{routeUrl}/{route.new}"
            class="btn btn-success btn-sm float-right"
            ><i class="fa-solid fa-plus" />
            {$__("any.addNew")}
          </Link>
        {/if}
      </div>
    </div>
  </div>
  <!-- /.card-header -->
  <div class="card-body p-0">
    <!-- svelte-ignore component-name-lowercase -->
    <table class="table table-sm table-hover table-striped">
      <Thead {keys} {titles} {order} {by} on:order={setOrder} />
      {#await promise}
        <div class="loading">
          <div class="absolute">
            <span>
              <Clock
                size="100"
                color="var(--{color})"
                unit="px"
                duration="10s"
              />
            </span>
          </div>
        </div>
      {:then datas}
        <Tbody
          {routeUrl}
          {apiUrl}
          {keys}
          {trash}
          {trashButton}
          rows={datas}
          on:delete={setPromise}
          on:restore={setPromise}
        />
      {/await}
    </table>
  </div>
  <div class="card-footer clearfix">
    <Limit {limit} on:limit={setLimit} />
    <Pagination {page} {total} {limit} on:page={setPage} {color} />
  </div>
  <!-- /.card-body -->
</div>

<style>
  .loading .absolute span {
    display: inline-block;
    margin-top: 100px;
  }
  .loading {
    height: 300px;
  }
  .loading .absolute {
    position: absolute;
    width: 100%;
    height: 300px;
    text-align: center;
    vertical-align: middle;
    z-index: 9999;
  }
  .clearfix::after {
    display: block;
    content: "";
    clear: both;
  }
</style>
