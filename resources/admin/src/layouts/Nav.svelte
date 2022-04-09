<script>
  import { languages, locale, __ } from "src/scripts/i18n.js";
  import { getSessionItem } from "src/scripts/session.js";
  import { create } from "src/scripts/crud.js";
  import { api } from "src/scripts/links.js";
  import { onMount } from "svelte";

  const auth = getSessionItem("auth");

  onMount(() => {
    if (auth) {
      if (typeof auth.options !== undefined) {
        if (typeof auth.options.language_preference !== undefined) {
          $locale = auth.options.language_preference;
        }
      }
    }
  });

  async function setLocale(lang) {
    $locale = lang;
    const response = await create(
      api.option,
      $__("notify.languagePreferenceSaved"),
      {
        type: "user",
        type_id: auth.id,
        key: "language_preference",
        value: lang,
      }
    );

    if (typeof response.message !== "undefined") {
      console.log(response.message);
    }
  }
</script>

<nav
  class="main-header navbar navbar-expand {auth.options.theme_navbar_bg} {auth
    .options.theme_navbar_no_border
    ? 'border-bottom-0'
    : ''}"
>
  <!-- Left navbar links -->
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" data-widget="pushmenu" href={"#"} role="button"
        ><i class="fas fa-bars" /></a
      >
    </li>
  </ul>

  <!-- Right navbar links -->
  <ul class="navbar-nav ml-auto">
    <!-- Navbar Search -->

    <li class="nav-item">
      <a class="nav-link" data-widget="navbar-search" href={"#"} role="button">
        <i class="fas fa-search" />
      </a>
      <div class="navbar-search-block">
        <form class="form-inline">
          <div class="input-group input-group-sm">
            <input
              class="form-control form-control-navbar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div class="input-group-append">
              <button class="btn btn-navbar" type="submit">
                <i class="fas fa-search" />
              </button>
              <button
                class="btn btn-navbar"
                type="button"
                data-widget="navbar-search"
              >
                <i class="fas fa-times" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </li>

    <!-- Messages Dropdown Menu -->
    <li class="nav-item dropdown">
      <a class="nav-link" data-toggle="dropdown" href={"#"}>
        <i class="far fa-comments" />
        <span class="badge badge-danger navbar-badge">3</span>
      </a>
      <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <a href={"#"} class="dropdown-item">
          <!-- Message Start -->
          <div class="media">
            <img
              src="/assets/admin/img/user1-128x128.jpg"
              alt="User Avatar"
              class="img-size-50 mr-3 img-circle"
            />
            <div class="media-body">
              <h3 class="dropdown-item-title">
                Brad Diesel
                <span class="float-right text-sm text-danger"
                  ><i class="fas fa-star" /></span
                >
              </h3>
              <p class="text-sm">Call me whenever you can...</p>
              <p class="text-sm text-muted">
                <i class="far fa-clock mr-1" /> 4 Hours Ago
              </p>
            </div>
          </div>
          <!-- Message End -->
        </a>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item">
          <!-- Message Start -->
          <div class="media">
            <img
              src="/assets/admin/img/user8-128x128.jpg"
              alt="User Avatar"
              class="img-size-50 img-circle mr-3"
            />
            <div class="media-body">
              <h3 class="dropdown-item-title">
                John Pierce
                <span class="float-right text-sm text-muted"
                  ><i class="fas fa-star" /></span
                >
              </h3>
              <p class="text-sm">I got your message bro</p>
              <p class="text-sm text-muted">
                <i class="far fa-clock mr-1" /> 4 Hours Ago
              </p>
            </div>
          </div>
          <!-- Message End -->
        </a>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item">
          <!-- Message Start -->
          <div class="media">
            <img
              src="..//assets/admin/img/user3-128x128.jpg"
              alt="User Avatar"
              class="img-size-50 img-circle mr-3"
            />
            <div class="media-body">
              <h3 class="dropdown-item-title">
                Nora Silvester
                <span class="float-right text-sm text-warning"
                  ><i class="fas fa-star" /></span
                >
              </h3>
              <p class="text-sm">The subject goes here</p>
              <p class="text-sm text-muted">
                <i class="far fa-clock mr-1" /> 4 Hours Ago
              </p>
            </div>
          </div>
          <!-- Message End -->
        </a>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item dropdown-footer">See All Messages</a>
      </div>
    </li>
    <!-- Notifications Dropdown Menu -->
    <li class="nav-item dropdown">
      <a class="nav-link" data-toggle="dropdown" href={"#"}>
        <i class="far fa-bell" />
        <span class="badge badge-warning navbar-badge">15</span>
      </a>
      <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <span class="dropdown-header">15 Notifications</span>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item">
          <i class="fas fa-envelope mr-2" /> 4 new messages
          <span class="float-right text-muted text-sm">3 mins</span>
        </a>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item">
          <i class="fas fa-users mr-2" /> 8 friend requests
          <span class="float-right text-muted text-sm">12 hours</span>
        </a>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item">
          <i class="fas fa-file mr-2" /> 3 new reports
          <span class="float-right text-muted text-sm">2 days</span>
        </a>
        <div class="dropdown-divider" />
        <a href={"#"} class="dropdown-item dropdown-footer"
          >See All Notifications</a
        >
      </div>
    </li>
    <li class="nav-item dropdown">
      <a
        class="nav-link"
        data-toggle="dropdown"
        href={"#"}
        aria-expanded="false"
      >
        <i class="flag-icon flag-icon-{$locale}" />
      </a>
      <div
        class="dropdown-menu dropdown-menu-right p-0"
        style="left: inherit; right: 0px;"
      >
        {#each languages as lang}
          <a href={"#"} on:click={() => setLocale(lang)} class="dropdown-item">
            <i class="flag-icon flag-icon-{lang} mr-2" />
            {lang.toUpperCase()}
          </a>
        {/each}
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-widget="fullscreen" href={"#"} role="button">
        <i class="fas fa-expand-arrows-alt" />
      </a>
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        data-widget="control-sidebar"
        data-slide="true"
        href={"#"}
        role="button"
      >
        <i class="fas fa-th-large" />
      </a>
    </li>
  </ul>
</nav>
