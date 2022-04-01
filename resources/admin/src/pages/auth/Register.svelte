<script>
  import { Link } from "svelte-navigator";
  import { __ } from "src/scripts/i18n.js";
  import { route } from "src/scripts/links.js";
  import Lang from "src/components/Lang.svelte";

  let activePassword = false;
  let activeRetypePassword = false;
  let typePassword = "password";
  let typeRetypePassword = "password";
  let fullName = "";
  let user = "";
  let password = "";
  let retypePassword = "";
  let agreeTerms = false;
  let error = "";

  const showHidePassword = (e) => {
    if (e.target.id === "password-show-hide") {
      activePassword = !activePassword;
      typePassword = activePassword ? "text" : "password";
    } else {
      activeRetypePassword = !activeRetypePassword;
      typeRetypePassword = activeRetypePassword ? "text" : "password";
    }
  };

  const getValue = (e) => {
    if (e.target.id === "password") {
      password = e.target.value;
    } else {
      retypePassword = e.target.value;
    }
  };

  async function register() {

    if (password !== retypePassword) {
      error = 'Passwords does not match';
      return;
    }

    const response = await registerUser(fullName, user, password, agreeTerms);

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
  <div class="register-box">
    <div class="card card-outline {error ? 'card-danger' : 'card-success'}">
      <div class="card-header text-center">
        <Lang />
        <a href="/" class="h1"><b>KM</b>PANEL</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">{$__("register.message")}</p>

        {#if error.includes("name")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="input-group mb-3">
          <input
            bind:value={fullName}
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
        {#if error.includes("email")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="input-group mb-3">
          <input
            bind:value={user}
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
        {#if error.includes("password")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="input-group mb-3">
          <input
            value={password}
            type={typePassword}
            class="form-control"
            placeholder={$__("title.password")}
            id="password"
            on:input={getValue}
          />
          <div class="input-group-append">
            <button
              class="input-group-text"
              on:click={showHidePassword}
              id="password-show-hide"
            >
              <span class="fas fa-eye" />
            </button>
          </div>
        </div>
        {#if error.includes("match")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="input-group mb-3">
          <input
            value={retypePassword}
            type={typeRetypePassword}
            class="form-control"
            placeholder={$__("title.retypePassword")}
            id="retype-password"
            on:input={getValue}
          />
          <div class="input-group-append">
            <button
              class="input-group-text"
              on:click={showHidePassword}
              id="retype-password-show-hide"
            >
              <span class="fas fa-eye" />
            </button>
          </div>
        </div>
        {#if error.includes("terms")}
          <div class="text-danger">{error}</div>
        {/if}
        <div class="row">
          <div class="col-8">
            <div class="icheck-success">
              <input
                type="checkbox"
                id="agreeTerms"
                name="terms"
                bind:checked={agreeTerms}
              />
              <label for="agreeTerms">
                I agree to the <a href="/">terms</a>
              </label>
            </div>
          </div>
          <!-- /.col -->
          <div class="col-4">
            <button on:click={register} class="btn btn-success btn-block">
              {$__("register.register")}
            </button>
          </div>
          <!-- /.col -->
        </div>

        <Link to="/{route.login}" class="text-center"
          >{$__("register.alreadyMember")}</Link
        >
      </div>
      <!-- /.form-box -->
    </div>
    <!-- /.card -->
  </div>
</div>
