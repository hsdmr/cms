<script>
  import { navigate } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { create, update, read } from "src/scripts/crud.js";
  import { api, route } from "src/scripts/links.js";
  import { onMount } from "svelte";
  import { Circle } from "svelte-loading-spinners";
  import { locale } from "src/scripts/i18n.js";

  export let id;

  const color = id == route.new ? "success" : "primary";
  let first_name = "";
  let last_name = "";
  let email;
  let username;
  let nickname;
  let role;
  let password;
  let retypePassword;

  let brandLogoBg = "";
  let navbarBg = "navbar-light bg-white";
  let sidebarBg = "sidebar-dark-primary";
  let sidebarNavFlat = false;
  let sidebarNavLegacy = false;
  let sidebarNavCompact = false;
  let sidebarNavChildIndent = false;
  let sidebarNavHideOnCollapse = false;
  let sidebarCollapsed = false;
  let sidebarExpand = false;
  let mainFixed = false;
  let navbarFixed = false;
  let navbarNoBorder = false;
  let footerFixed = false;
  let textSize = false;
  let darkMode = false;

  let error = "";
  let loading = false;

  let roles = ["admin", "editor"];

  async function getData() {
    if (id != route.new) {
      loading = true;
      const res = await read(api.user, id);
      loading = false;

      if (typeof res.id !== "undefined") {
        first_name = res.first_name;
        last_name = res.last_name;
        email = res.email;
        username = res.username;
        nickname = res.nickname;
        role = res.role;
        password = res.password;

        brandLogoBg = res.options.brandLogoBg;
        navbarBg = res.options.navbarBg;
        sidebarBg = res.options.sidebarBg;
        sidebarNavFlat = res.options.sidebarNavFlat;
        sidebarNavLegacy = res.options.sidebarNavLegacy;
        sidebarNavCompact = res.options.sidebarNavCompact;
        sidebarNavChildIndent = res.options.sidebarNavChildIndent;
        sidebarNavHideOnCollapse = res.options.sidebarNavHideOnCollapse;
        sidebarCollapsed = res.options.sidebarCollapsed;
        sidebarExpand = res.options.sidebarExpand;
        mainFixed = res.options.mainFixed;
        navbarNoBorder = res.options.navbarNoBorder;
        navbarFixed = res.options.navbarFixed;
        footerFixed = res.options.footerFixed;
        textSize = res.options.textSize;
        darkMode = res.options.darkMode;
      }
    }
  }

  onMount(getData);

  async function submit() {
    loading = true;

    const options = {
      brandLogoBg: brandLogoBg,
      navbarBg: navbarBg,
      sidebarBg: sidebarBg,
      sidebarNavFlat: sidebarNavFlat,
      sidebarNavLegacy: sidebarNavLegacy,
      sidebarNavCompact: sidebarNavCompact,
      sidebarNavChildIndent: sidebarNavChildIndent,
      sidebarNavHideOnCollapse: sidebarNavHideOnCollapse,
      sidebarCollapsed: sidebarCollapsed,
      mainFixed: mainFixed,
      sidebarExpand: sidebarExpand,
      navbarNoBorder: navbarNoBorder,
      navbarFixed: navbarFixed,
      footerFixed: footerFixed,
      textSize: textSize,
      darkMode: darkMode,
      languagePreference: $locale,
    };

    if (id == route.new) {
      const res = await create(api.user, "User create successfully", {
        first_name,
        last_name,
        email,
        username,
        nickname,
        role,
        password,
        password_verified: retypePassword,
        options,
      });
      loading = false;

      if (typeof res.id !== "undefined") {
        navigate(`/${route.admin}/${route.users}/${res.id}`);
      }

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    } else {
      const res = await update(api.user, id, "User updated successfully", {
        first_name,
        last_name,
        email,
        username,
        nickname,
        role,
        password,
        password_verified: retypePassword,
        options,
      });
      loading = false;

      if (typeof res.message !== "undefined") {
        error = res.message;
      }
    }
  }

  $: title = id != route.new ? first_name + " " + last_name : $__("any.addNew");
  $: links = [
    { pageUrl: route.admin, pageTitle: $__("title.dashboard") },
    { pageUrl: route.admin + "/" + route.users, pageTitle: $__("title.users") },
  ];
</script>

<Breadcrump {title} {links} />
<div class="container-fluid users">
  <div class="row">
    <div class="col-md-9">
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <div class="form-group">
            <label class="col-form-label" for="first_name"
              >{$__("title.firstName")}</label
            >
            <input
              bind:value={first_name}
              type="text"
              class="form-control"
              id="first_name"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="last_name"
              >{$__("title.lastName")}</label
            >
            <input
              bind:value={last_name}
              type="text"
              class="form-control"
              id="last_name"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="email"
              >{$__("title.email")}</label
            >
            {#if error.includes("email")}
              <div class="text-danger float-right">{error}</div>
            {/if}
            <input
              bind:value={email}
              type="text"
              class="form-control"
              id="email"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="username"
              >{$__("title.username")}</label
            >
            {#if error.includes("username")}
              <div class="text-danger float-right">{error}</div>
            {/if}
            <input
              bind:value={username}
              type="text"
              class="form-control"
              id="username"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="nickname"
              >{$__("title.nickname")}</label
            >
            <input
              bind:value={nickname}
              type="text"
              class="form-control"
              id="nickname"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="password"
              >{$__("title.password")}</label
            >
            {#if error.includes("password")}
              <div class="text-danger float-right">{error}</div>
            {/if}
            <input
              bind:value={password}
              type="text"
              class="form-control"
              id="password"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="retypePassword"
              >{$__("title.retypePassword")}</label
            >
            {#if error.includes("password")}
              <div class="text-danger float-right">{error}</div>
            {/if}
            <input
              bind:value={retypePassword}
              type="text"
              class="form-control"
              id="retypePassword"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label" for="role">{$__("title.role")}</label>
            <select class="form-control" id="role" bind:value={role}>
              {#each roles as item}
                <option value={item}>{item}</option>
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
      <div class="card card-outline card-{color}">
        <div class="card-body">
          <h5>{$__("any.customize")}</h5>
          <hr class="mb-2" />
          <div class="mb-4">
            <input
              bind:checked={darkMode}
              id="darkMode"
              type="checkbox"
              value="dark-mode"
              class="mr-1"
            /><label for="darkMode">{$__("any.darkMode")}</label>
          </div>
          <h6>{$__("any.headerOptions")}</h6>
          <div class="mb-1">
            <input
              bind:checked={navbarNoBorder}
              id="noBorder"
              type="checkbox"
              value="layout-navbar-fixed"
              class="mr-1"
            /><label for="noBorder">{$__("any.noBorder")}</label>
          </div>
          <div class="mb-4">
            <input
              bind:checked={navbarFixed}
              id="fixed1"
              type="checkbox"
              value="layout-navbar-fixed"
              class="mr-1"
            /><label for="fixed1">{$__("any.fixed")}</label>
          </div>
          <h6>{$__("any.sidebarOptions")}</h6>
          <div class="mb-1">
            <input
              bind:checked={sidebarCollapsed}
              id="collapsed"
              type="checkbox"
              value="collapsed"
              class="mr-1"
            /><label for="collapsed">{$__("any.collapsed")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={mainFixed}
              id="fixed2"
              type="checkbox"
              value="layout-fixed"
              class="mr-1"
            /><label for="fixed2">{$__("any.fixed")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={sidebarNavFlat}
              id="navFlat"
              type="checkbox"
              value="nav-flat"
              class="mr-1"
            /><label for="navFlat">{$__("any.navFlat")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={sidebarNavLegacy}
              id="navLegacy"
              type="checkbox"
              value="nav-legacy"
              class="mr-1"
            /><label for="navLegacy">{$__("any.navLegacy")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={sidebarNavCompact}
              id="navCompact"
              type="checkbox"
              value="nav-compact"
              class="mr-1"
            /><label for="navCompact">{$__("any.navCompact")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={sidebarNavChildIndent}
              id="navChildIndent"
              type="checkbox"
              value="nav-child-indent"
              class="mr-1"
            /><label for="navChildIndent">{$__("any.navChildIndent")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={sidebarNavHideOnCollapse}
              id="navChildHideOnCollapse"
              type="checkbox"
              value="nav-collapse-hide-child"
              class="mr-1"
            /><label for="navChildHideOnCollapse"
              >{$__("any.navChildHideOnCollapse")}</label
            >
          </div>
          <div class="mb-4">
            <input
              bind:checked={sidebarExpand}
              id="disableHoverFocusAutoExpand"
              type="checkbox"
              value="sidebar-no-expand"
              class="mr-1"
            /><label for="disableHoverFocusAutoExpand"
              >{$__("any.disableHoverFocusAutoExpand")}</label
            >
          </div>
          <h6>{$__("any.footerOptions")}</h6>
          <div class="mb-4">
            <input
              bind:checked={footerFixed}
              id="fixed3"
              type="checkbox"
              value="layout-footer-fixed"
              class="mr-1"
            /><label for="fixed3">{$__("any.fixed")}</label>
          </div>
          <h6>{$__("any.smallTextOption")}</h6>
          <div class="mb-4">
            <input
              bind:checked={textSize}
              id="body1"
              type="checkbox"
              value="text-sm"
              class="mr-1"
            /><label for="body1">{$__("any.body")}</label>
          </div>
          <h6>{$__("any.navbarVariants")}</h6>
          <div class="d-flex">
            <select
              class="custom-select mb-3 text-light border-0 bg-white"
              bind:value={navbarBg}
            >
              <option class="bg-primary" value="navbar-dark bg-primary"
                >{$__("any.primary")}</option
              >
              <option class="bg-secondary" value="navbar-dark bg-secondary"
                >{$__("any.secondary")}</option
              >
              <option class="bg-info" value="navbar-dark bg-info"
                >{$__("any.info")}</option
              >
              <option class="bg-success" value="navbar-dark bg-success"
                >{$__("any.success")}</option
              >
              <option class="bg-danger" value="navbar-dark bg-danger"
                >{$__("any.danger")}</option
              >
              <option class="bg-indigo" value="navbar-dark bg-indigo"
                >{$__("any.indigo")}</option
              >
              <option class="bg-purple" value="navbar-dark bg-purple"
                >{$__("any.purple")}</option
              >
              <option class="bg-pink" value="navbar-dark bg-pink"
                >{$__("any.pink")}</option
              >
              <option class="bg-navy" value="navbar-dark bg-navy"
                >{$__("any.navy")}</option
              >
              <option class="bg-lightblue" value="navbar-dark bg-lightblue"
                >{$__("any.lightblue")}</option
              >
              <option class="bg-teal" value="navbar-dark bg-teal"
                >{$__("any.teal")}</option
              >
              <option class="bg-cyan" value="navbar-dark bg-cyan"
                >{$__("any.cyan")}</option
              >
              <option class="bg-dark" value="navbar-dark bg-dark"
                >{$__("any.dark")}</option
              >
              <option class="bg-gray-dark" value="navbar-dark bg-gray-dark"
                >{$__("any.grayDark")}</option
              >
              <option class="bg-gray" value="navbar-dark bg-gray"
                >{$__("any.gray")}</option
              >
              <option class="bg-light" value="navbar-light bg-light"
                >{$__("any.light")}</option
              >
              <option class="bg-warning" value="navbar-light bg-warning"
                >{$__("any.warning")}</option
              >
              <option class="bg-white" value="navbar-light bg-white"
                >{$__("any.white")}</option
              >
              <option class="bg-orange" value="navbar-light bg-orange"
                >{$__("any.orange")}</option
              >
            </select>
          </div>
          <h6>{$__("any.sidebarVariants")}</h6>
          <div class="d-flex" />
          <select class="custom-select mb-3 border-0" bind:value={sidebarBg}>
            <option value="">{$__("any.noneSelected")}</option>
            <option value="sidebar-dark-primary"
              >{$__("any.dark")} - {$__("any.primary")}</option
            >
            <option value="sidebar-dark-warning"
              >{$__("any.dark")} - {$__("any.warning")}</option
            >
            <option value="sidebar-dark-info"
              >{$__("any.dark")} - {$__("any.info")}</option
            >
            <option value="sidebar-dark-danger"
              >{$__("any.dark")} - {$__("any.danger")}</option
            >
            <option value="sidebar-dark-success"
              >{$__("any.dark")} - {$__("any.success")}</option
            >
            <option value="sidebar-dark-indigo"
              >{$__("any.dark")} - {$__("any.indigo")}</option
            >
            <option value="sidebar-dark-lightblue"
              >{$__("any.dark")} - {$__("any.lightblue")}</option
            >
            <option value="sidebar-dark-navy"
              >{$__("any.dark")} - {$__("any.navy")}</option
            >
            <option value="sidebar-dark-purple"
              >{$__("any.dark")} - {$__("any.purple")}</option
            >
            <option value="sidebar-dark-fuchsia"
              >{$__("any.dark")} - {$__("any.fuchsia")}</option
            >
            <option value="sidebar-dark-pink"
              >{$__("any.dark")} - {$__("any.pink")}</option
            >
            <option value="sidebar-dark-maroon"
              >{$__("any.dark")} - {$__("any.maroon")}</option
            >
            <option value="sidebar-dark-orange"
              >{$__("any.dark")} - {$__("any.orange")}</option
            >
            <option value="sidebar-dark-lime"
              >{$__("any.dark")} - {$__("any.lime")}</option
            >
            <option value="sidebar-dark-teal"
              >{$__("any.dark")} - {$__("any.teal")}</option
            >
            <option value="sidebar-dark-olive"
              >{$__("any.dark")} - {$__("any.olive")}</option
            >
            <option value="sidebar-light-primary"
              >{$__("any.light")} - {$__("any.primary")}</option
            >
            <option value="sidebar-light-warning"
              >{$__("any.light")} - {$__("any.warning")}</option
            >
            <option value="sidebar-light-info"
              >{$__("any.light")} - {$__("any.info")}</option
            >
            <option value="sidebar-light-danger"
              >{$__("any.light")} - {$__("any.danger")}</option
            >
            <option value="sidebar-light-success"
              >{$__("any.light")} - {$__("any.success")}</option
            >
            <option value="sidebar-light-indigo"
              >{$__("any.light")} - {$__("any.indigo")}</option
            >
            <option value="sidebar-light-lightblue"
              >{$__("any.light")} - {$__("any.lightblue")}</option
            >
            <option value="sidebar-light-navy"
              >{$__("any.light")} - {$__("any.navy")}</option
            >
            <option value="sidebar-light-purple"
              >{$__("any.light")} - {$__("any.purple")}</option
            >
            <option value="sidebar-light-fuchsia"
              >{$__("any.light")} - {$__("any.fuchsia")}</option
            >
            <option value="sidebar-light-pink"
              >{$__("any.light")} - {$__("any.pink")}</option
            >
            <option value="sidebar-light-maroon"
              >{$__("any.light")} - {$__("any.maroon")}</option
            >
            <option value="sidebar-light-orange"
              >{$__("any.light")} - {$__("any.orange")}</option
            >
            <option value="sidebar-light-lime"
              >{$__("any.light")} - {$__("any.lime")}</option
            >
            <option value="sidebar-light-teal"
              >{$__("any.light")} - {$__("any.teal")}</option
            >
            <option value="sidebar-light-olive"
              >{$__("any.light")} - {$__("any.olive")}</option
            >
          </select>
          <h6>{$__("any.brandLogoVariants")}</h6>
          <div class="d-flex" />
          <select class="custom-select mb-3 border-0" bind:value={brandLogoBg}>
            <option value="">{$__("any.noneSelected")}</option>
            <option class="bg-primary" value="navbar-dark bg-primary"
              >{$__("any.primary")}</option
            >
            <option class="bg-secondary" value="navbar-dark bg-secondary"
              >{$__("any.secondary")}</option
            >
            <option class="bg-info" value="navbar-dark bg-info"
              >{$__("any.info")}</option
            >
            <option class="bg-success" value="navbar-dark bg-success"
              >{$__("any.success")}</option
            >
            <option class="bg-danger" value="navbar-dark bg-danger"
              >{$__("any.danger")}</option
            >
            <option class="bg-indigo" value="navbar-dark bg-indigo"
              >{$__("any.indigo")}</option
            >
            <option class="bg-purple" value="navbar-dark bg-purple"
              >{$__("any.purple")}</option
            >
            <option class="bg-pink" value="navbar-dark bg-pink"
              >{$__("any.pink")}</option
            >
            <option class="bg-navy" value="navbar-dark bg-navy"
              >{$__("any.navy")}</option
            >
            <option class="bg-lightblue" value="bg-lightblue"
              >{$__("any.lightblue")}</option
            >
            <option class="bg-teal" value="navbar-dark bg-teal"
              >{$__("any.teal")}</option
            >
            <option class="bg-cyan" value="navbar-dark bg-cyan"
              >{$__("any.cyan")}</option
            >
            <option class="bg-dark" value="navbar-dark bg-dark"
              >{$__("any.dark")}</option
            >
            <option class="bg-gray-dark" value="navbar-dark bg-gray-dark"
              >{$__("any.grayDark")}</option
            >
            <option class="bg-gray" value="navbar-dark bg-gray"
              >{$__("any.gray")}</option
            >
            <option class="bg-light" value="navbar-light bg-light"
              >{$__("any.light")}</option
            >
            <option class="bg-warning" value="navbar-light bg-warning"
              >{$__("any.warning")}</option
            >
            <option class="bg-white" value="navbar-light bg-white"
              >{$__("any.white")}</option
            >
            <option class="bg-orange" value="navbar-light bg-orange"
              >{$__("any.orange")}</option
            >
          </select>
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
