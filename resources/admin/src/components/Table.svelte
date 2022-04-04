<script>
  import { __ } from "src/scripts/i18n.js";
  import { createEventDispatcher } from "svelte";
  import Limit from "./Limit.svelte";
  import Pagination from "./Pagination.svelte";
  import Search from "./Search.svelte";
  import Tbody from "./Tbody.svelte";
  import Thead from "./Thead.svelte";

  const dispatch = createEventDispatcher();
  
  export let titles;
  export let rows;
  export let keys;
  export let search;
  export let total;
  export let limit;
  export let page;
  export let order;
  export let by;

  const setOrder = (event) => {
    by = event.detail.by;
    order = event.detail.order;
    console.log(order);
    console.log(by);
    searchParams();
  };

  const setSearch = (event) => {
    search = event.detail.search;
    console.log(search);
    searchParams();
  };

  const setLimit = (event) => {
    limit = event.detail.limit;
    console.log(limit);
    searchParams();
  };

  const setPage = (event) => {
    page = event.detail.page;
    console.log(page);
    searchParams();
  };

  const searchParams = () => {
    dispatch("searchParams", { search, limit, page, order, by });
  };
</script>

<div class="card">
  <div class="card-header">
    <Limit {limit} on:limit={setLimit} />
    <Search {search} on:search={setSearch} />
  </div>
  <!-- /.card-header -->
  <div class="card-body p-0">
    <!-- svelte-ignore component-name-lowercase -->
    <table class="table table-sm table-hover table-striped">
      <Thead {keys} {titles} {order} {by} on:order={setOrder} />
      <Tbody {keys} {rows} />
    </table>
  </div>
  <div class="card-footer clearfix">
    <Pagination {page} {total} {limit} on:page={setPage} />
  </div>
  <!-- /.card-body -->
</div>
