import { usePreferredColorScheme } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum UserTheme {
  preferred,
  light,
  dark
}

export const useUserSettings = async () => {
  const innerStore = defineStore('settings', {
    state: () => ({
      settings: ref<{ setting: string, value: string }[]> ([])
    }),
    getters: {
      theme (state) {
        const user = useUser();
        if (!user && localStorage.getItem('theme')) {
          return localStorage.getItem('theme');
        }

        let themeState = state.settings.find((storedSetting) => { return storedSetting.setting === 'theme' });

        if (themeState) {
          return themeState.value;
        } else {
          if (usePreferredColorScheme().value === 'no-preference') return 'dark';
          return usePreferredColorScheme().value;
        }
      }
    },
    actions: {
      set (setting: string, value: any, local?: boolean) {
        if (typeof value !== 'string') value = JSON.stringify(value);

        const i = this.settings.findIndex(storedSetting => storedSetting.setting === setting);
        if (i > -1) this.settings[i].value = value;
        else this.settings.push({ setting: setting, value: value });

        if (local) {
          localStorage.setItem(setting, value);
        }

        this._syncDB(setting, value);
      },

      async _syncDB (setting: string, value: string) {
        const toast = useToast();

        try {
          await $fetch('/api/userSetting/set', {
            method: "POST",
            body: {
              setting: setting,
              value: value
            }
          })
        } catch (e: any) {
          toast.add({
            title: 'Error',
            description: e.message,
            color: 'red'
          })
        }
      }
    }
  });

  try {
    const s = innerStore();
    const result = await $fetch('/api/userSetting/get');

    result.forEach((setting) => {
      s.settings.push(setting as any);
    });

    return s;
  } catch (e: any) {
    console.log(e)
    return innerStore();
  }
};