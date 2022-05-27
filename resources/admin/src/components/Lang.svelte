<script>
  import { languages, locale } from "src/scripts/i18n.js";
  function setLocale(lang) {
    $locale = lang;
  }
</script>

<span class="dropdown float-right">
  <a data-toggle="dropdown" href={"#"} aria-expanded="false">
    <i class="flag-icon flag-icon-{$locale}" />
  </a>
  <div
    class="dropdown-menu dropdown-menu-right p-0"
    style="left: inherit; right: 0px;"
  >
    {#each languages as lang}
      <a href={"#"} on:click={() => setLocale(lang)} class="dropdown-item">
        <i class="flag-icon flag-icon-{lang} mr-2" />
        {lang.toUpperCase()}
      </a>
    {/each}
  </div>
</span>
