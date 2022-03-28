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

  let authStatus = true;
</script>

<Translator>
  <Router>
    <div class={authStatus ? "sidebar-mini" : "login-page"}>
      <Route path="login" component={Login} />
      <Route path="register" component={Register} />
      <Route path="forget-password" component={Password} />
      <Route path="admin/*" meta={{ name: "admin" }}>
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
              <Route path="users">
                <Users />
              </Route>
              <Route path="layouts">
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
