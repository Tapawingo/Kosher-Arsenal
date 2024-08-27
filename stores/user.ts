import { usePreferredColorScheme } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum UserTheme {
  preferred,
  light,
  dark
}

declare interface UserSettings {
  theme: UserTheme
}

/* @TODO: https://github.com/atinux/nuxt-auth-utils */

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: ref(),
    settings: ref<UserSettings>({
      theme: UserTheme.preferred
    })
  }),
  actions: {
    themeIsDarkmode(): boolean {
      if (this.settings.theme === UserTheme.dark) return true;
      if (this.settings.theme === UserTheme.preferred) {
        if (usePreferredColorScheme().value === 'dark') return true;
      };
      
      return false;
    },

    toggleTheme() {
      if (this.settings.theme === UserTheme.dark || usePreferredColorScheme().value === 'dark') {
        this.settings.theme = UserTheme.light;
      } else {
        this.settings.theme = UserTheme.dark;
      };
    },

    setTheme(theme: UserTheme) {
      this.settings.theme = theme;
      /* Save to user profile */
    }
  }
})
