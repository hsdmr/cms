<script>
  import { APP_ROOT } from "src/scripts/links.js";
  import { Link, navigate } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import { route } from "src/scripts/links.js";
  import { deleteUserDetails } from "src/scripts/auth.js";
  import { getSessionItem } from "src/scripts/session.js";

  const auth = getSessionItem("auth");

  $: url = window.location.pathname.split("/");

  function setUrl() {
    url = window.location.pathname.split("/");
  }

  let bodyClass =
    "sidebar-mini " +
    (auth.options.theme_sidebar_collapsed ? "sidebar-collapse" : "") +
    " " +
    (auth.options.theme_text_size ? "text-sm" : "") +
    " " +
    (auth.options.theme_main_fixed ? "layout-fixed" : "") +
    " " +
    (auth.options.theme_navbar_fixed ? "layout-navbar-fixed" : "") +
    " " +
    (auth.options.theme_footer_fixed ? "layout-footer-fixed" : "") +
    " " +
    (auth.options.theme_dark_mode ? "dark-mode" : "");

  document.body.classList = bodyClass;

  async function logout() {
    const response = await deleteUserDetails(auth.access_token);

    if (response) {
      console.log(response);
      navigate("/login");
    }
  }
</script>

<aside
  class="main-sidebar elevation-4 {auth.options.theme_sidebar_expand
    ? 'sidebar-no-expand'
    : ''} {auth.options.theme_sidebar_bg}"
>
  <!-- Brand Logo -->
  <a href="/" class="brand-link {auth.options.theme_brand_logo_bg}">
    <img
      src="{APP_ROOT}/assets/admin/img/AdminLTELogo.png"
      alt="AdminLTE Logo"
      class="brand-image img-circle elevation-3"
      style="opacity: 0.8"
    />
    <span class="brand-text font-weight-light">KM PANEL</span>
  </a>

  <!-- Sidebar -->
  <div class="sidebar">
    <!-- SidebarSearch Form -->
    <div class="form-inline mt-3">
      <div class="input-group" data-widget="sidebar-search">
        <input
          class="form-control form-control-sidebar"
          type="search"
          placeholder={$__("any.search")}
          aria-label="Search"
        />
        <div class="input-group-append">
          <button class="btn btn-sidebar">
            <i class="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul
        class="nav nav-pills nav-sidebar flex-column {auth.options
          .theme_sidebar_nav_flat
          ? 'nav-flat'
          : ''} {auth.options.theme_sidebar_nav_legacy
          ? 'nav-legacy'
          : ''} {auth.options.theme_sidebar_nav_compact
          ? 'nav-compact'
          : ''} {auth.options.theme_sidebar_nav_child_indent
          ? 'nav-child-indent'
          : ''} {auth.options.theme_sidebar_nav_hide_on_collapse
          ? 'nav-collapse-hide-child'
          : ''}"
        data-widget="treeview"
        role="menu"
        data-accordion="false"
      >
        <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
        <li class="nav-item" on:click={setUrl}>
          <Link
            to="/{route.admin}"
            class="nav-link {url[1] === 'admin' && !url.hasOwnProperty(2)
              ? 'active'
              : ''}"
          >
            <i class="nav-icon fas fa-th" />
            <p>
              {$__("title.dashboard")}
            </p>
          </Link>
        </li>
        <li class="nav-item" on:click={setUrl}>
          <Link
            to="/{route.admin}/{route.users}"
            class="nav-link {url[1] === 'admin' &&
            (url[2] === 'users' || url[2] === 'user')
              ? 'active'
              : ''}"
          >
            <i class="nav-icon fas fa-users" />
            <p>
              {$__("title.users")}
            </p>
          </Link>
        </li>
        <li
          class="nav-item {url[1] === 'admin' && url[2] === 'layouts'
            ? 'menu-open active'
            : ''}"
        >
          <a
            href={"#"}
            class="nav-link {url[1] === 'admin' && url[2] === 'layouts'
              ? 'active'
              : ''}"
          >
            <i class="nav-icon fa-solid fa-gears" />
            <p>
              {$__("title.options")}
              <i class="right fas fa-angle-left" />
            </p>
          </a>
          <ul class="nav nav-treeview">
            <li class="nav-item" on:click={setUrl}>
              <Link
                to="/{route.admin}/{route.layouts}"
                class="nav-link {url[1] === 'admin' && url[2] === 'layouts'
                  ? 'active'
                  : ''}"
              >
                <i class="nav-icon fas fa-table-columns" />
                <p>
                  {$__("title.layouts")}
                </p>
              </Link>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <a href={"#"} on:click={logout} class="nav-link">
            <i class="nav-icon fa-solid fa-power-off text-danger" />
            <p class="text">{$__("title.logout")}</p>
          </a>
        </li>
      </ul>
    </nav>
    <!-- /.sidebar-menu -->
  </div>
  <!-- /.sidebar -->
</aside>
