import { defineStore } from 'pinia'

interface ITab {
  label: string;
  callback: string | Function;
}

export const useSitenavStore = defineStore('sitenav', {
  state: () => ({
    tabs: ref<ITab[]>([]),
    current_tab: ref<string>()
  }),
  actions: {
    setTabs(tabs: ITab[]) {
      tabs.forEach((tab) => {
        tabs.push({
          label: tab.label,
          callback: tab.callback.toString()
        })
      })
    }
  }
})
