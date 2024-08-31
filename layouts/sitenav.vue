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
      <NuxtLink v-if="!user" to="/signin">Login</NuxtLink>
      <NuxtLink v-if="!user" to="/signup">Register</NuxtLink>
      {{ user?.username }}
      <NuxtLink v-if="user" @click="signout">Logout</NuxtLink>
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

  const user = useUser();

  const signout = async () => {
    await useFetch("/api/auth/signout", {
      method: "POST"
    });
    
    reloadNuxtApp();
  }
</script>