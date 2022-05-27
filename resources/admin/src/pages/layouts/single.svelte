<script>
  import { navigate } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { create, read, get } from "src/scripts/crud.js";
  import { api, route } from "src/scripts/links.js";
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";

  export let id;

  $: color = id == route.new ? "success" : "primary";
  let title = "";
  let top = "";
  let content = "";
  let bottom = "";
  let language = "";
  let which = "";
  let status = "";

  $: whichSelect = [];
  $: statusSelect = [];

  let error = "";
  let loading = false;

  async function getData() {
    const constants = await get(api.layoutConstants);
    whichSelect = constants.which;
    statusSelect = constants.status;
    which = whichSelect[0];
    status = statusSelect[0];

    if (id != route.new) {
      loading = true;
      const res = await read(api.layout, id);
      loading = false;

      if (typeof res.id !== "undefined") {
        title = res.title;
        top = res.top;
        content = res.content;
        bottom = res.bottom;
        which = res.which;
        status = res.status;
        language = res.language;
      }
    }
  }

  onMount(getData);

  async function submit() {
    loading = true;

    if (id == route.new) {
      const res = await create(
        api.layout,
        $__("notify.createdSuccessfully", { title: title }),
        {
          title,
          top,
          content,
          bottom,
          which,
          status,
          language,
        }
      );
      loading = false;

      if (typeof res.id !== "undefined") {
        navigate(`/${route.admin}/${route.options}/${route.layouts}/${res.id}`);
      }

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    } else {
      const res = await update(
        api.layout,
        $__("notify.updatedSuccessfully", { title: title }),
        {
          title,
          top,
          content,
          bottom,
          which,
          status,
          language,
        }
      );
      loading = false;

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    }
  }

  $: pageTitle = id != route.new ? title : $__("any.addNew");
  $: links = [
    { pageUrl: route.admin, pageTitle: $__("any.dashboard") },
    {
      pageUrl: route.admin + "/" + route.options + "/" + route.layouts,
      pageTitle: $__("any.layouts"),
    },
  ];
</script>

<Breadcrump title={pageTitle} {links} />
<div class="container-fluid roles">
  <div class="row">
    <div class="col-md-9">
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="title">{$__("any.title")}</label>
            <input
              bind:value={title}
              type="text"
              class="form-control"
              id="title"
            />
          </div>
        </div>
      </div>
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="top">{$__("any.top")}</label>
            <textarea
              class="form-control"
              id="top"
              cols="30"
              rows="10"
              bind:value={top}
            />
          </div>
        </div>
      </div>
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="content"
              >{$__("any.content")}</label
            >
            <textarea
              class="form-control"
              id="content"
              cols="30"
              rows="10"
              bind:value={content}
            />
          </div>
        </div>
      </div>
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="bottom"
              >{$__("any.bottom")}</label
            >
            <textarea
              class="form-control"
              id="bottom"
              cols="30"
              rows="10"
              bind:value={bottom}
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card card-outline card-{color}">
        <div class="card-body text-center">
          <div style="display: inline;float: right;">
            {#if loading}
              <Circle
                size="38"
                color="var(--success)"
                unit="px"
                duration="2s"
              />
            {:else}
              <button
                type="button"
                class="btn btn-success float-right"
                on:click={submit}>{$__("any.save")}</button
              >
            {/if}
          </div>
        </div>
      </div>
      <div class="card card-outline card-{color}">
        <div class="card-body text-center">
          <label class="col-form-label" for="status">{$__("any.status")}</label>
          <select id="status" class="form-control" bind:value={status}>
            {#each statusSelect as item}
              <option value={item}>{$__("any." + item)}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="card card-outline card-{color}">
        <div class="card-body text-center">
          <label class="col-form-label" for="which">{$__("any.which")}</label>
          <select id="which" class="form-control" bind:value={which}>
            {#each whichSelect as item}
              <option value={item}>{$__("any." + item)}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
