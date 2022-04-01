<script>
  import { Link, navigate } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import { getUserDetails } from "src/scripts/auth.js";
  import Lang from "src/components/Lang.svelte";
  import { route } from "src/scripts/links.js";

  let active = false;
  let type = "password";
  let user = "hsdmrsoft@gmail.com";
  let password = "Rest135**";
  let rememberMe = false;
  let error = "";

  const showHidePassword = () => {
    active = !active;
    type = active ? "text" : "password";
  };
  
  const getValue = (e) => {
    password = e.target.value;
  };

  async function login() {
    const response = await getUserDetails(user, password);

    if (typeof response.access_token !== "undefined") {
      console.log(response);
      if (error) error = "";
      navigate(route.admin);
    }

    if (typeof response.message !== "undefined") {
      error = response.message;
    }
  }
</script>

<div class="login-page">
  <div class="login-box">
    <!-- /.login-logo -->
    <div class="card card-outline {error ? 'card-danger' : 'card-success'}">
      <div class="card-header text-center">
        <Lang />
        <a href="/" class="h1"><b>KM</b>PANEL</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">{$__("login.message")}</p>

        {#if error.includes("email")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="input-group mb-3">
          <input
            bind:value={user}
            type="text"
            class="form-control"
            placeholder={$__("title.email")}
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-envelope" />
            </div>
          </div>
        </div>
        {#if error.includes("password")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="input-group mb-3">
          <input
            {type}
            value={password}
            class="form-control"
            placeholder={$__("title.password")}
            on:input={getValue}
          />
          <div class="input-group-append">
            <button on:click={showHidePassword} class="input-group-text">
              <span class="fas fa-eye" />
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <div class="icheck-success">
              <input type="checkbox" id="remember" bind:checked={rememberMe} />
              <label for="remember">
                {$__("login.rememberMe")}
              </label>
            </div>
          </div>
          <!-- /.col -->
          <div class="col-4">
            <button on:click={login} class="btn btn-success btn-block">
              {$__("login.signIn")}
            </button>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.social-auth-links -->

        <p class="mb-1">
          <Link to="/{route.forgetPassword}">{$__("login.forgetPassword")}</Link
          >
        </p>
        <p class="mb-0">
          <Link to="/{route.register}" class="text-center"
            >{$__("login.registerNew")}</Link
          >
        </p>
      </div>
      <!-- /.card-body -->
    </div>
    <!-- /.card -->
  </div>
  <!-- /.login-box -->
</div>
