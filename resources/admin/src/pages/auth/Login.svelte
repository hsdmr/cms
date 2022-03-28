<script>
  import { Link } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import { urls } from "src/scripts/urls.js";
  import Lang from "src/components/Lang.svelte";

  let email;
  let password;
  
  const submit = async () => {
    response = await fetch(urls.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password })
    }).then((data) => {
      console.log(data.json());
    });
  }
</script>

<div class="login-page">
  <div class="login-box">
    <p>{urls.login}</p> 
    <p>{email}</p> 
    <p>{password}</p> 
    <!-- /.login-logo -->
    <div class="card card-outline card-success">
      <div class="card-header text-center">
        <Lang />
        <a href="/" class="h1"><b>KM</b>PANEL</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">{$__("login.message")}</p>

        <div class="input-group mb-3">
          <input
            bind:value={email}
            type="email"
            class="form-control"
            placeholder={$__("title.email")}
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-envelope" />
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
          <input
            bind:value={password}
            type="password"
            class="form-control"
            placeholder={$__("title.password")}
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <div class="icheck-success">
              <input type="checkbox" id="remember" />
              <label for="remember">
                {$__("login.rememberMe")}
              </label>
            </div>
          </div>
          <!-- /.col -->
          <div class="col-4">
            <button
              type="submit"
              on:click={submit()}
              class="btn btn-success btn-block">{$__("login.signIn")}</button
            >
          </div>
          <!-- /.col -->
        </div>
        <!-- /.social-auth-links -->

        <p class="mb-1">
          <Link to="/forget-password">{$__("login.forgetPassword")}</Link>
        </p>
        <p class="mb-0">
          <Link to="/register" class="text-center"
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
