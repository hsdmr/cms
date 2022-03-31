<script>
  import Translator from "src/components/Translator.svelte";
  import { __ } from "src/scripts/i18n.js";
  import { navigate, Route, Router } from "svelte-navigator";
  import Login from "src/pages/auth/Login.svelte";
  import Register from "src/pages/auth/Register.svelte";
  import Password from "src/pages/auth/Password.svelte";
  import Nav from "src/layouts/Nav.svelte";
  import MainSidebar from "src/layouts/MainSidebar.svelte";
  import ControlSidebar from "src/layouts/ControlSidebar.svelte";
  import Footer from "src/layouts/Footer.svelte";
  import Users from "src/pages/users/index.svelte";
  import Layouts from "src/pages/layouts/index.svelte";
  import Dashboard from "src/pages/Dashboard.svelte";
  import { onMount } from "svelte";
  import { getSessionItem } from "src/scripts/session.js";
  import { checkUserDetails } from "src/scripts/datas.js";
  import { route } from "src/scripts/links";

  const auth = getSessionItem("auth");

  async function checkAuth(auth = null) {
    const response = [];
    if (auth) {
      response = await checkUserDetails(auth.access_token);
    }
    if (!response) {
      navigate("/login");
      return false;
    }
    return true;
  }
  onMount(checkAuth(auth));
</script>

<Translator>
  <Router>
    <div class="sidebar-mini">
      <Route path={route.login} component={Login} />
      <Route path={route.register} component={Register} />
      <Route path={route.forgetPassword} component={Password} />
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
              <Route path={route.home}>
                <Dashboard />
              </Route>
              <Route path={route.users}>
                <Users />
              </Route>
              <Route path={route.layouts}>
                <Layouts />
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
</Translator>
