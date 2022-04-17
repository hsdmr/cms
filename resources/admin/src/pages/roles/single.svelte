<script>
  import { navigate } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { create, update, read } from "src/scripts/crud.js";
  import { api, route } from "src/scripts/links.js";
  import { onMount } from "svelte";
  import { DoubleBounce } from "svelte-loading-spinners";
  
  export let id;

  const color = id == route.new ? "success" : "primary";
  let role = "";
  let allPermissions = [];
  let permissions = [];

  let error = "";
  let loading = false;

  async function getData() {
    if (id != route.new) {
      loading = true;
      const role = await read(api.role, id);
      loading = false;

      if (typeof user.id !== "undefined") {
        role = role.key;
        permissions = role.value;
      }
    }
    const allPermissions = await search(api.option +
        `?get=one&type=admin_panel&key=permission`);
  }

  onMount(getData);

  async function submit() {
    loading = true;

    if (id == route.new) {
      const res = await create(api.user, "Role create successfully", {
        role,
        permissions,
      });
      loading = false;

      if (typeof res.id !== "undefined") {
        navigate(`/${route.admin}/${route.users}/${res.id}`);
      }

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    } else {
      const res = await create(api.user, "Role updated successfully", {
        role,
        permissions,
      });
      loading = false;

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    }
  }
  
  $: title = id != route.new ? key : $__("any.addNew");
  $: links = [
    { pageUrl: route.admin, pageTitle: $__("title.dashboard") },
    { pageUrl: route.admin + "/" + route.roles, pageTitle: $__("title.roles") },
  ];
</script>

<Breadcrump {title} {links} />
<div class="container roles">
  <div class="row">
    <div class="col-md-9">
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="role"
              >{$__("title.role")}</label
            >
            <input
              bind:value={role}
              type="text"
              class="form-control"
              id="role"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="role">{$__("title.role")}</label>
            <select class="form-control" id="role" bind:value={role}>
              {#each allPermissions as item}
              <label>
                <input type=checkbox bind:group={permissions} name="permissions" value={item}>
                {item}
              </label>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card card-outline card-{color}">
        <div class="card-body text-center">
          <div style="display: inline;float: right;">
            {#if loading}
              <DoubleBounce size="38" color="#28a745" unit="px" duration="2s" />
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
        <div class="card-body">

        </div>
      </div>
    </div>
  </div>
</div>

<style>
  select {
    font-weight: 700;
  }
</style>
