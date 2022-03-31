<script>
  import { Link } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import { route } from "src/scripts/links.js";
  import Lang from "src/components/Lang.svelte";

  const submit = () => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => initialize(json))
      .catch((err) => console.error(`Fetch problem: ${err.message}`));
  };
</script>

<div class="login-page">
  <div class="register-box">
    <div class="card card-outline card-success">
      <div class="card-header text-center">
        <Lang />
        <a href="/" class="h1"><b>KM</b>PANEL</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">{$__("register.message")}</p>

        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder={$__("title.fullName")}
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-user" />
            </div>
          </div>
        </div>
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
        <div class="input-group mb-3">
          <input
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
        <div class="input-group mb-3">
          <input
            type="password"
            class="form-control"
            placeholder={$__("title.retypePassword")}
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
              <input
                type="checkbox"
                id="agreeTerms"
                name="terms"
                value="agree"
              />
              <label for="agreeTerms">
                I agree to the <a href="/">terms</a>
              </label>
            </div>
          </div>
          <!-- /.col -->
          <div class="col-4">
            <button on:click={submit} class="btn btn-success btn-block">
              {$__("register.register")}
            </button>
          </div>
          <!-- /.col -->
        </div>

        <Link to="{route.login}" class="text-center"
          >{$__("register.alreadyMember")}</Link
        >
      </div>
      <!-- /.form-box -->
    </div>
    <!-- /.card -->
  </div>
</div>
