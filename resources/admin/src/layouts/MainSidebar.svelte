<script>
  import { APP_ROOT } from "src/scripts/urls.js"
  import { Link } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
</script>

<aside class="main-sidebar sidebar-dark-primary elevation-4">
  <!-- Brand Logo -->
  <a href="/" class="brand-link">
    <img
      src="{APP_ROOT}/assets/admin/img/AdminLTELogo.png"
      alt="AdminLTE Logo"
      class="brand-image img-circle elevation-3"
      style="opacity: 0.8"
    />
    <span class="brand-text font-weight-light">AdminLTE 3</span>
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
        class="nav nav-pills nav-sidebar flex-column"
        data-widget="treeview"
        role="menu"
        data-accordion="false"
      >
        <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
        <li class="nav-item">
          <Link to="" class="nav-link">
            <i class="nav-icon fas fa-th" />
            <p>
              {$__("title.dashboard")}
            </p>
          </Link>
        </li>
        <li class="nav-item">
          <Link to="users" class="nav-link">
            <i class="nav-icon fas fa-users" />
            <p>
              {$__("title.users")}
            </p>
          </Link>
        </li>
        <li class="nav-item menu-open">
          <a href={"#"} class="nav-link">
            <i class="nav-icon fa-solid fa-gears" />
            <p>
              {$__("title.options")}
              <i class="right fas fa-angle-left" />
            </p>
          </a>
          <ul class="nav nav-treeview">
            <li class="nav-item">
              <Link to="layouts" class="nav-link">
                <i class="nav-icon fas fa-table-columns" />
                <p>
                  {$__("title.layouts")}
                </p>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <!-- /.sidebar-menu -->
  </div>
  <!-- /.sidebar -->
</aside>
