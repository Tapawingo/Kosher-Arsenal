import { usePreferredColorScheme } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum UserTheme {
  preferred,
  light,
  dark
}

export const useUserSettingsStore = defineStore('userSettings', {
  state: () => ({
    theme: ref<UserTheme>(UserTheme.preferred)
  }),
  actions: {
    themeIsDarkmode(): boolean {
      if (this.theme === UserTheme.dark) return true;
      if (this.theme === UserTheme.preferred) {
        if (usePreferredColorScheme().value === 'dark') return true;
      };

      return false;
    },

    toggleTheme() {
      if (this.theme === UserTheme.dark || usePreferredColorScheme().value === 'dark') {
        this.theme = UserTheme.light;
      } else {
        this.theme = UserTheme.dark;
      };
    }
  }
})
