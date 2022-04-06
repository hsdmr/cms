<script>
  import { __ } from "src/scripts/i18n.js";
  import Breadcrump from "src/components/Breadcrump.svelte";
  import { create, update, read } from "src/scripts/crud.js";
  import { api } from "src/scripts/links.js";

  $: title = $__("title.users");
  $: active = title;
  $: links = [{ pageUrl: "admin", pageTitle: $__("title.dashboard") }];

  let first_name = 'Murat';
  let last_name = 'Hasdemir';
  let email = 'q@c.c';
  let username = 'hs';
  let nickname = 'hs';
  let role = 'admin';
  let password = '1';
  let retypePassword = '1';

  let brand_logo_bg;
  let navbar_bg;
  let main_sidebar_bg;
  let main_sidebar_nav_style = [];
  let main_sidebar_collapsed;
  let main_fixed;
  let main_sidebar_expand;
  let navbar_fixed;
  let footer_fixed;
  let text_size;
  let dark_mode;

  let roles = ["admin", "editor"];
  let promise;

  let options;

  async function submit() {
    options = {
      theme_brand_logo_bg: brand_logo_bg,
      theme_navbar_bg: navbar_bg,
      theme_main_sidebar_bg: main_sidebar_bg,
      theme_main_sidebar_nav_style: main_sidebar_nav_style.join(" "),
      theme_main_sidebar_collapsed:
        main_sidebar_collapsed == "true" ? "sidebar-collapse" : "",
      theme_main_fixed: main_fixed == "true" ? "layout-fixed" : "",
      theme_main_sidebar_expand:
        main_sidebar_expand == "true" ? "sidebar-no-expand" : "",
      theme_navbar_fixed: navbar_fixed == "true" ? "layout-navbar-fixed" : "",
      theme_footer_fixed: footer_fixed == "true" ? "layout-footer-fixed" : "",
      theme_text_size: text_size == "true" ? "text-sm" : "",
      theme_dark_mode: dark_mode == "true" ? "dark-mode" : "",
    };

    if (password == retypePassword) {
      promise = await create(api.user, {
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
    }
  }
</script>

<Breadcrump {title} {active} {links} />
<div class="container-fluid users">
  <div class="row">
    <div class="col-md-9">
      <div class="card">
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
      <div class="card">
        <div class="card-body">
          {#await promise}
            <button type="button" class="btn btn-success float-right" disabled
              >{$__("any.save")}</button
            >
          {:then value}
            <button
              type="button"
              class="btn btn-success float-right"
              on:click={submit}>{$__("any.save")}</button
            >
          {:catch error}
            {toastr.error(error.message)}
          {/await}
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5>{$__("any.customize")}</h5>
          <hr class="mb-2" />
          <div class="mb-4">
            <input
              bind:checked={dark_mode}
              id="darkMode"
              type="checkbox"
              value="dark-mode"
              class="mr-1"
            /><label for="darkMode">{$__("any.darkMode")}</label>
          </div>
          <h6>{$__("any.headerOptions")}</h6>
          <div class="mb-4">
            <input
              bind:checked={navbar_fixed}
              id="fixed1"
              type="checkbox"
              value="layout-navbar-fixed"
              class="mr-1"
            /><label for="fixed1">{$__("any.fixed")}</label>
          </div>
          <h6>{$__("any.sidebarOptions")}</h6>
          <div class="mb-1">
            <input
              bind:checked={main_sidebar_collapsed}
              id="collapsed"
              type="checkbox"
              value="collapsed"
              class="mr-1"
            /><label for="collapsed">{$__("any.collapsed")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:checked={main_fixed}
              id="fixed2"
              type="checkbox"
              value="layout-fixed"
              class="mr-1"
            /><label for="fixed2">{$__("any.fixed")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:group={main_sidebar_nav_style}
              id="navFlat"
              type="checkbox"
              value="nav-flat"
              class="mr-1"
            /><label for="navFlat">{$__("any.navFlat")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:group={main_sidebar_nav_style}
              id="navLegacy"
              type="checkbox"
              value="nav-legacy"
              class="mr-1"
            /><label for="navLegacy">{$__("any.navLegacy")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:group={main_sidebar_nav_style}
              id="navCompact"
              type="checkbox"
              value="nav-compact"
              class="mr-1"
            /><label for="navCompact">{$__("any.navCompact")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:group={main_sidebar_nav_style}
              id="navChildIndent"
              type="checkbox"
              value="nav-child-indent"
              class="mr-1"
            /><label for="navChildIndent">{$__("any.navChildIndent")}</label>
          </div>
          <div class="mb-1">
            <input
              bind:group={main_sidebar_nav_style}
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
              bind:checked={main_sidebar_expand}
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
              bind:checked={footer_fixed}
              id="fixed3"
              type="checkbox"
              value="layout-footer-fixed"
              class="mr-1"
            /><label for="fixed3">{$__("any.fixed")}</label>
          </div>
          <h6>{$__("any.smallTextOption")}</h6>
          <div class="mb-4">
            <input
              bind:checked={text_size}
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
              bind:value={navbar_bg}
            >
              <option class="bg-primary" value="navbar-dark bg-primary"
                >Primary</option
              >
              <option class="bg-secondary" value="navbar-dark bg-secondary"
                >Secondary</option
              >
              <option class="bg-info" value="navbar-dark bg-info">Info</option>
              <option class="bg-success" value="navbar-dark bg-success"
                >Success</option
              >
              <option class="bg-danger" value="navbar-dark bg-danger"
                >Danger</option
              >
              <option class="bg-indigo" value="navbar-dark bg-indigo"
                >Indigo</option
              >
              <option class="bg-purple" value="navbar-dark bg-purple"
                >Purple</option
              >
              <option class="bg-pink" value="navbar-dark bg-pink">Pink</option>
              <option class="bg-navy" value="navbar-dark bg-navy">Navy</option>
              <option class="bg-lightblue" value="navbar-dark bg-lightblue"
                >Lightblue</option
              >
              <option class="bg-teal" value="navbar-dark bg-teal">Teal</option>
              <option class="bg-cyan" value="navbar-dark bg-cyan">Cyan</option>
              <option class="bg-dark" value="navbar-dark bg-dark">Dark</option>
              <option class="bg-gray-dark" value="navbar-dark bg-gray-dark"
                >Gray dark</option
              >
              <option class="bg-gray" value="navbar-dark bg-gray">Gray</option>
              <option class="bg-light" value="navbar-dark bg-light"
                >Light</option
              >
              <option class="bg-warning" value="navbar-light bg-warning"
                >Warning</option
              >
              <option class="bg-white" value="navbar-light bg-white"
                >White</option
              >
              <option class="bg-orange" value="navbar-light bg-orange"
                >Orange</option
              >
            </select>
          </div>
          <h6>{$__("any.sidebarVariants")}</h6>
          <div class="d-flex" />
          <select
            class="custom-select mb-3 border-0"
            bind:value={main_sidebar_bg}
          >
            <option>{$__("any.noneSelected")}</option>
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
          <select
            class="custom-select mb-3 border-0"
            bind:value={brand_logo_bg}
          >
            <option>{$__("any.noneSelected")}</option>
            <option class="bg-primary">Primary</option>
            <option class="bg-secondary">Secondary</option>
            <option class="bg-info">Info</option>
            <option class="bg-success">Success</option>
            <option class="bg-danger">Danger</option>
            <option class="bg-indigo">Indigo</option>
            <option class="bg-purple">Purple</option>
            <option class="bg-pink">Pink</option>
            <option class="bg-navy">Navy</option>
            <option class="bg-lightblue">Lightblue</option>
            <option class="bg-teal">Teal</option>
            <option class="bg-cyan">Cyan</option>
            <option class="bg-dark">Dark</option>
            <option class="bg-gray-dark">Gray dark</option>
            <option class="bg-gray">Gray</option>
            <option class="bg-light">Light</option>
            <option class="bg-warning">Warning</option>
            <option class="bg-white">White</option>
            <option class="bg-orange">Orange</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
