<script>
  import { Link } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import Lang from "src/components/Lang.svelte";
</script>

<div class="login-page">
  <div class="login-box">
    <div class="card card-outline card-success">
      <div class="card-header text-center">
        <Lang />
        <a href="/" class="h1"><b>KM</b>PANEL</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">
          {$__("password.message")}
        </p>
        <form action="" method="post">
          <div class="input-group mb-3">
            <input
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
          <div class="row">
            <div class="col-12">
              <Link type="submit" to="/login" class="btn btn-success btn-block"
                >{$__("password.requestNew")}</Link
              >
            </div>
            <!-- /.col -->
          </div>
        </form>
        <p class="mt-3 mb-1">
          <Link to="/login">{$__("password.login")}</Link>
        </p>
      </div>
      <!-- /.login-card-body -->
    </div>
  </div>
</div>
