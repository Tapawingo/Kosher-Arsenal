import { ref, reactive, capitalize } from "vue";
import { defineStore } from "pinia";
import { arsenal } from '@/modules/arsenal';

interface loadingScreen {
  shown: boolean,
  loaded: number,
  text: string
};

interface contextMenuItem {
  type: string,
  title?: string,
  action: any
};

interface contextMenu {
  shown: boolean,
  title: string,
  items: Array<contextMenuItem>
};

interface modalItem {
  type: string,
  title?: string,
  focus?: string,
  default?: any,
  item?: arsenal.Item,
  category?: arsenal.Category
};

interface modal {
  title: string,
  priority?: number,
  items: Array<modalItem>
};

export const useArsenalStore = defineStore('arsenal', {
  state: () => {
    return {
      mode: ref<number>(0), // 0 = Preview, 1 = Edit
      loadout: reactive<arsenal.Loadout> (new arsenal.Loadout()),
      selectedMainCategory: reactive<arsenal.Category> (new arsenal.Category()),
      selectedMainItem: reactive<arsenal.Item> (new arsenal.Item()),
      selectedItemCategory: reactive<arsenal.Category> (new arsenal.Category()),
      selectedItemItem: reactive<arsenal.Item> (new arsenal.Item()),
      loadingScreen: reactive<loadingScreen> ({ shown: false, loaded: 0, text: 'Loading...' }),
      contextMenu: reactive<contextMenu> ({ shown: false, title: '', items: [] }),
      modals: reactive<Array<modal>> ([])
    }
  },

  actions: {
    /* Setters */
    updateLoadout: function (loadout: arsenal.Loadout): void { this.loadout = loadout; },
    setSelectedMainCategory: function (category: arsenal.Category | null): void { this.selectedMainCategory = category ? category : new arsenal.Category(); },
    setSelectedMainItem: function (item: arsenal.Item | null): void { this.selectedMainItem = item ? item : new arsenal.Item(); },
    setSelectedItemCategory: function (category: arsenal.Category | null): void { this.selectedItemCategory = category ? category : new arsenal.Category(); },
    setSelectedItemItem: function (item: arsenal.Item | null): void { this.selectedItemItem = item ? item : new arsenal.Item(); },
    setSelectedCategory: function (context: String, category: arsenal.Category | null) {
      if (context === 'main') {
        this.selectedMainCategory = category ? category : new arsenal.Category();
      } else if (context === 'item') {
        this.selectedItemCategory = category ? category : new arsenal.Category();
      };
    },
    setSelectedItem: function (context: String, item: arsenal.Item | null) {
      if (context === 'main') {
        this.selectedMainItem = item ? item : new arsenal.Item();
      } else if (context === 'item') {
        this.selectedItemItem = item ? item : new arsenal.Item();
      };
    },

    /* Methods */
    updateLoadingScreen: function (loaded: number, text: string | null = null): void {
      this.loadingScreen.loaded = loaded;
      this.loadingScreen.text = text ? text : this.loadingScreen.text;
    },
    showLoadingScreen: function (show: boolean): void { this.loadingScreen.shown = show; },
    updateContextMenu: function (title: string, items: Array<contextMenuItem>) {
      this.contextMenu.title = title;
      this.contextMenu.items = items;
    },
    showContextMenu: function (show: boolean) { this.contextMenu.shown = show; },
    addModal: function (modal: modal) {
      this.modals.push(modal);
    },
    removeModal: function (modal: modal) {
      const index = this.modals.indexOf(modal);
      this.modals.splice(index);
    },
    initArsenal: function (loadout: arsenal.Loadout, mode: number = 0): void { this.loadout = loadout; this.mode = mode; }

    // @TODO Create setters to set categories and items by ID in loadout (save user changes)
  }
})
