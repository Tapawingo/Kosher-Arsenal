<template>
  <header class="sitenav">
    <NuxtImg :src="authStore.themeIsDarkmode() ? '/logo_white.svg' : '/logo.svg'" />
    <nav>
      <NuxtLink active-class="active" to="/">Loadouts</NuxtLink>
      <NuxtLink class="disabled" active-class="active">Gear Database</NuxtLink>
      <NuxtLink class="disabled" active-class="active">Reference Images</NuxtLink>
    </nav>
    <div class="search-container">
      <input type="search" placeholder="Search..." />
    </div>
    <div class="user-container">
      <button class="disabled">Login</button>
      <button class="disabled">Register</button>
    </div>
    <div class="settings-container">
      <button @click="authStore.toggleTheme()">
        <Icon name="material-symbols:dark-mode" />
      </button>
      <button>
        <Icon name="material-symbols:settings" />
      </button>
    </div>
  </header>

  <slot />
</template>

<script lang="ts" setup>
  const authStore = useAuthStore();
</script>