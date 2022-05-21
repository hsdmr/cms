<script>
  import { Link } from "svelte-navigator";
  import { createEventDispatcher } from "svelte";
  import NavItem from "src/components/NavItem.svelte";
  import { getSessionItem } from "src/scripts/session.js";

  const auth = getSessionItem("auth");
  const dispatch = createEventDispatcher();

  function splitTo(to, index) {
    return to.split("/")[index];
  }

  function setUrl() {
    dispatch("setUrl");
  }

  export let url = "";
  export let title = "";
  export let to = "";
  export let icon = "";
  export let permission = "";
  export let subMenu = [];
  console.log(permission);
</script>

{#if subMenu.length == 0}
  {#if (auth.permissions.includes(permission) || permission == "")}
    <li class="nav-item" on:click={setUrl}>
      <Link
        {to}
        class="nav-link {url[1] === splitTo(to, 1) && url[2] === splitTo(to, 2)
          ? 'active'
          : ''}"
      >
        <i class="nav-icon {icon}" />
        <p>
          {title}
        </p>
      </Link>
    </li>
  {/if}
{:else}
  <li
    class="nav-item {url[1] === splitTo(to, 1) && url[2] === splitTo(to, 2)
      ? 'menu-open active'
      : ''}"
  >
    <a
      href={to}
      class="nav-link {url[1] === splitTo(to, 1) && url[2] === splitTo(to, 2)
        ? 'active'
        : ''}"
    >
      <i class="nav-icon {icon}" />
      <p>
        {title}
        <i class="right fas fa-angle-left" />
      </p>
    </a>
    <ul class="nav nav-treeview">
      {#each subMenu as item}
        <NavItem
          title={item.title}
          to={item.to}
          icon={item.icon}
          subMenu={item.subMenu}
          permission={item.permission}
          {url}
          on:setUrl={setUrl}
        />
      {/each}
    </ul>
  </li>
{/if}
