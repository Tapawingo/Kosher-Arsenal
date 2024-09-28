<template>
  <div class="sitenav-container">
    <header class="sitenav">
      <Logo />
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
        <button v-if="user" class="user" @click="viewProfile(user.username)">{{ user.username }}</button>
        <button v-if="user" @click="signout">Logout</button>
      </div>
      <div class="settings-container">
        <button @click="toggleTheme()">
          <Icon name="material-symbols:dark-mode" />
        </button>
        <button>
          <Icon name="material-symbols:settings" />
        </button>
      </div>
    </header>
  </div>

  <slot />
</template>

<script lang="ts" setup>
  const userSettings = await useUserSettings();
  const user = useUser();

  const { theme } = storeToRefs(userSettings);

  const viewProfile = async (username: string) => {
    await navigateTo(`/profile/${ username }`);
  }

  const toggleTheme = () => {
    if (theme.value === 'dark') {
      userSettings.set('theme', 'light', true);
    } else {
      userSettings.set('theme', 'dark', true);
    }
  };

  const signout = async () => {
    await useFetch("/api/auth/signout", {
      method: "POST"
    });
    
    reloadNuxtApp();
  }
</script>