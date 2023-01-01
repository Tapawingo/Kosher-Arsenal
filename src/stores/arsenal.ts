import { ref, reactive, capitalize } from "vue";
import { defineStore } from "pinia";
import { arsenal } from '@/modules/arsenal';

interface loadingScreen {
  container: HTMLDivElement | null,
  textContainer: HTMLSpanElement | null,
  progressBar: HTMLDivElement | null,
  loaded: number,
  text: string
}

export const useArsenalStore = defineStore('arsenal', {
  state: () => {
    return {
      mode: ref<number>(0), // 0 = Preview, 1 = Edit
      loadout: reactive<arsenal.Loadout> (new arsenal.Loadout()),
      selectedMainCategory: reactive<arsenal.Category> (new arsenal.Category()),
      selectedMainItem: reactive<arsenal.Item> (new arsenal.Item()),
      selectedItemCategory: reactive<arsenal.Category> (new arsenal.Category()),
      selectedItemItem: reactive<arsenal.Item> (new arsenal.Item()),
      loadingScreen: { container: null, textContainer: null, progressBar: null, loaded: 0, text: 'Loading...' } as loadingScreen
    }
  },

  actions: {
    /* Setters */
    updateLoadout: function (loadout: arsenal.Loadout): void { this.loadout = loadout; },
    initLoadingScreen: function (container: HTMLDivElement, textContainer: HTMLSpanElement, progressBar: HTMLDivElement): void { 
      this.loadingScreen.container = container;
      this.loadingScreen.textContainer = textContainer;
      this.loadingScreen.progressBar = progressBar; 
    },
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
    updateLoadingScreen: function (loaded: number): void {
      this.loadingScreen.loaded = loaded;
      if (this.loadingScreen.progressBar != null) {
        this.loadingScreen.progressBar.style.width = `${loaded}%`;
      }
    },
    updateLoadingScreenText: function (text: string): void {
      this.loadingScreen.text = text;
      if (this.loadingScreen.textContainer != null) {
        this.loadingScreen.textContainer.innerHTML = `${text}...`;
      }
    },
    showLoadingScreen(show: Boolean): void {
      if (this.loadingScreen.container != null) {
        if (show) {
          this.loadingScreen.container.style.display = 'block';
        } else {
          this.loadingScreen.container.style.display = 'none';
        }
      };
    },
    initArsenal: function (loadout: arsenal.Loadout, mode: number = 0): void { this.loadout = loadout; this.mode = mode; },
    startArsenal: async function (): Promise<void> {
      await new Promise((resolve) => {
        if (this.loadout != null) {
          resolve(uiInitEvent);
        };
      });

      this.updateLoadingScreenText('Initializing arsenal UI');
      this.updateLoadingScreen(80);
      var uiInitEvent = new CustomEvent('arsenal-ui-init', { detail: {} });
      window.dispatchEvent(uiInitEvent);
      this.updateLoadingScreen(100);
      this.showLoadingScreen(false);
    },

    // @TODO Create setters to set categories and items by ID in loadout (save user changes)
  }
})
