<template>
  <header class="sitenav">
    <NuxtImg :src="userSettings.themeIsDarkmode() ? '/logo_white.svg' : '/logo.svg'" />
    <nav>
      <NuxtLink active-class="active" to="/">Loadouts</NuxtLink>
      <NuxtLink active-class="active" to="/geardb">Gear Database</NuxtLink>
      <NuxtLink active-class="active" to="/refs">Reference Images</NuxtLink>
    </nav>
    <div class="search-container">
      <input type="search" placeholder="Search..." />
    </div>
    <div class="user-container">
      <button>Login</button>
      <button>Register</button>
    </div>
    <div class="settings-container">
      <button @click="userSettings.toggleTheme()">
        <Icon name="material-symbols:dark-mode" />
      </button>
      <button>
        <Icon name="material-symbols:settings" />
      </button>
    </div>
  </header>

  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
  const userSettings = useUserSettingsStore();
</script>

<style lang="scss">
  
</style>