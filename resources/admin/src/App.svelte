<script>
  import Translator from "src/components/Translator.svelte";
  import { __ } from "src/scripts/i18n.js";
  import { Route, Router } from "svelte-navigator";
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
  import { route } from "src/scripts/links";

</script>

<Translator>
  <Router>
    <div class="sidebar-mini">
      <Route path={route.login} primary={false}><Login /></Route>
      <Route path={route.register} primary={false}><Register /></Route>
      <Route path={route.forgetPassword} primary={false}><Password /></Route>
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
