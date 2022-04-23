<script>
  import { navigate } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { create, read, search } from "src/scripts/crud.js";
  import { api, route } from "src/scripts/links.js";
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";

  export let id;

  const color = id == route.new ? "success" : "primary";
  let role = "";
  let permissions = [];
  $: allPermissions = [];

  let error = "";
  let loading = false;

  async function getData() {
    let res = await search(
      api.option + `?get=one&type=admin_panel&key=permissions`
    );
    console.log(res);
    allPermissions = res.data.value;

    if (id != route.new) {
      loading = true;
      res = await read(api.role, id);
      loading = false;

      if (typeof res.id !== "undefined") {
        role = res.key;
        permissions = res.value;
      }
    }
  }

  onMount(getData);

  async function submit() {
    loading = true;

    if (id == route.new) {
      const res = await create(api.role, "Role create successfully", {
        role,
        permissions,
      });
      loading = false;

      if (typeof res.id !== "undefined") {
        navigate(`/${route.admin}/${route.roles}/${res.id}`);
      }

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    } else {
      const res = await create(api.role, "Role updated successfully", {
        role,
        permissions,
      });
      loading = false;

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    }
  }

  const selectAll = (event) => {
    if (event.target.checked) {
      permissions = allPermissions;
    } else {
      permissions = [];
    }
  };

  $: title = id != route.new ? role : $__("any.addNew");
  $: links = [
    { pageUrl: route.admin, pageTitle: $__("title.dashboard") },
    { pageUrl: route.admin + "/" + route.roles, pageTitle: $__("title.roles") },
  ];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid roles">
  <div class="row">
    <div class="col-md-9">
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="role">{$__("title.role")}</label>
            <input
              bind:value={role}
              type="text"
              class="form-control"
              id="role"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="role"
              >{$__("title.permissions")}</label
            >
            <div class="row">
              <label for="" class="col-sm-2">
                <div class="custom-control custom-checkbox">
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    on:change={selectAll}
                    id="customCheckbox"
                  />
                  <label for="customCheckbox" class="custom-control-label"
                    >{$__("any.selectAll")}</label
                  >
                </div>
              </label>
            </div>
            <div class="row">
              {#each allPermissions as item, i}
                <label for="" class="col-sm-2">
                  <div class="custom-control custom-checkbox">
                    <input
                      class="custom-control-input"
                      type="checkbox"
                      bind:group={permissions}
                      id="customCheckbox{i}"
                      value={item}
                    />
                    <label for="customCheckbox{i}" class="custom-control-label"
                      >{$__("permission." + item)}</label
                    >
                  </div>
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card card-outline card-{color}">
        <div class="card-body text-center">
          <div style="display: inline;float: right;">
            {#if loading}
              <Circle size="38" color="var(--success)" unit="px" duration="2s" />
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
    </div>
  </div>
</div>
