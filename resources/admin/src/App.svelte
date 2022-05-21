<script>
  import { __ } from "src/scripts/i18n.js";
  import { Route, Router, navigate } from "svelte-navigator";
  import Login from "src/pages/auth/Login.svelte";
  import Register from "src/pages/auth/Register.svelte";
  import Password from "src/pages/auth/Password.svelte";
  import Nav from "src/layouts/Nav.svelte";
  import MainSidebar from "src/layouts/MainSidebar.svelte";
  import ControlSidebar from "src/layouts/ControlSidebar.svelte";
  import Footer from "src/layouts/Footer.svelte";
  import Users from "src/pages/users/index.svelte";
  import UsersTrash from "src/pages/users/trash.svelte";
  import UserSingle from "src/pages/users/single.svelte";
  import Roles from "src/pages/roles/index.svelte";
  import RoleSingle from "src/pages/roles/single.svelte";
  import Layouts from "src/pages/layouts/index.svelte";
  import LayoutsTrash from "src/pages/layouts/trash.svelte";
  import LayoutsSingle from "src/pages/layouts/single.svelte";
  import Dashboard from "src/pages/Dashboard.svelte";
  import { route } from "src/scripts/links.js";
  import { checkAuth } from "src/scripts/auth.js";
  import { getSessionItem } from "src/scripts/session.js";

  let auth = getSessionItem("auth");

  const authenticated = () => {
    auth = getSessionItem("auth");
    window.location.replace(route.admin);
    //navigate(route.admin);
  };

  if (!auth) {
    checkAuth();
  }
</script>

<Router>
  <div class="sidebar-mini">
    <Route path={route.login} primary={false}>
      <Login on:authenticated={authenticated} />
    </Route>
    <Route path={route.register} primary={false}>
      <Register />
    </Route>
    <Route path={route.forgetPassword} primary={false}>
      <Password />
    </Route>
    <Route path="{route.admin}/*" meta={{ name: "admin" }}>
      <div class="wrapper">
        <!-- Navbar -->
        <Nav />
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <MainSidebar />

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
          <div class="content">
            <Route path="/">
              <Dashboard />
            </Route>
            <Route path="{route.users}/*">
              <Route path="/">
                {#if auth.permissions.includes("userSearch")}
                  <Users />
                {/if}
              </Route>
              <Route path="{route.trash}/">
                {#if auth.permissions.includes("userSearch")}
                  <UsersTrash />
                {/if}
              </Route>
              <Route path=":id" let:params>
                {#if (auth.permissions.includes("userCreate") && params.id == "new") || (auth.permissions.includes("userRead") && params.id != "new")}
                  <UserSingle id={params.id} />
                {/if}
              </Route>
            </Route>
            <Route path="{route.roles}/*">
              <Route path="/">
                {#if auth.permissions.includes("roleSearch")}
                  <Roles />
                {/if}
              </Route>
              <Route path=":id" let:params>
                {#if (auth.permissions.includes("roleCreate") && params.id == "new") || (auth.permissions.includes("roleRead") && params.id != "new")}
                  <RoleSingle id={params.id} />
                {/if}
              </Route>
            </Route>
            <Route path="{route.options}/*">
              <Route path="{route.layouts}/*">
                <Route path="/">
                  {#if auth.permissions.includes("layoutSearch")}
                    <Layouts />
                  {/if}
                </Route>
                <Route path="{route.trash}/">
                  {#if auth.permissions.includes("layoutSearch")}
                    <LayoutsTrash />
                  {/if}
                </Route>
                <Route path=":id" let:params>
                  {#if (auth.permissions.includes("layoutCreate") && params.id == "new") || (auth.permissions.includes("layoutRead") && params.id != "new")}
                    <LayoutsSingle id={params.id} />
                  {/if}
                </Route>
              </Route>
            </Route>
          </div>
        </div>
        <!-- /.content-wrapper -->

        <!-- Control Sidebar -->
        <ControlSidebar />
        <!-- /.control-sidebar -->

        <!-- Main Footer -->
        <Footer />
      </div>
    </Route>
  </div>
</Router>
