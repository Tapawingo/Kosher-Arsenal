import { defineStore } from 'pinia'
import { ArsenalLoadout, type ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { type ArsenalItemJson } from '~/classes/ArsenalItem';
import { type ArsenalCategoryJson } from '~/classes/ArsenalCategory';
import { ArsenalMode } from '~/types/arsenal';

export enum ArsenalStates {
  loading,
  ready,
  error
}

export const useArsenalStore = defineStore('arsenal', {
  state: () => {
    return {
      mode: ref<ArsenalMode> (ArsenalMode.view),
      arsenalState: ref<ArsenalStates> (ArsenalStates.loading),
      loadout: ref<ArsenalLoadoutJson> (new ArsenalLoadout().toJSON()),
      selectedCategory: ref<ArsenalCategoryJson | null> (null),
      selectedItem: ref<ArsenalItemJson | null> (null),
      selectedSubCategory: ref<ArsenalCategoryJson | null> (null),
      selectedSubItem: ref<ArsenalItemJson | null> (null)
    }
  },
  getters: {
    getCategories: (state): Array<ArsenalCategoryJson> => {
      const categories = state.loadout.categories;
      categories.sort((a: ArsenalCategoryJson, b: ArsenalCategoryJson) => {
        return a.position - b.position;
      })

      return categories;
    }
  },
  actions: {
    setMode (mode: ArsenalMode): void { this.mode = mode },

    async fetchLoadout (loadoutID: string) { 
      this.arsenalState = ArsenalStates.loading;
      const loadoutJson: ArsenalLoadoutJson | undefined = await $fetch(`/api/fetchLoadout/${ loadoutID }`)

      if (loadoutJson) {
        this.loadout = loadoutJson;
        this.arsenalState = ArsenalStates.ready;
      } else {
        this.arsenalState = ArsenalStates.error;
      };
    },

    setSelectedCategory (category: ArsenalCategoryJson | null): void { 
      this.selectedCategory = category;
      this.selectedItem = null;
      this.selectedSubCategory = null;
      this.selectedSubItem = null;
    },

    setSelectedSubCategory (category: ArsenalCategoryJson | null): void { 
      this.selectedSubCategory = category;
      this.selectedSubItem = null;
    },

    setSelectedItem (item: ArsenalItemJson | null): void { 
      this.selectedItem = item;
      this.selectedSubCategory = null;
      this.selectedSubItem = null;
    },

    setSelectedSubItem (item: ArsenalItemJson | null): void { 
      this.selectedSubItem = item
    },

    addCategory (category: ArsenalCategoryJson): void {
      const index = this.loadout.categories.push(category) - 1;
      category.position = index;
    },

    addSubCategory (category: ArsenalCategoryJson): void {
      if (!this.selectedItem) return;
      const index = this.selectedItem.categories.push(category) - 1;
      category.position = index;
    },

    removeCategory (categoryID: string): boolean {
      const categoryIndex = this.loadout.categories.findIndex((category: ArsenalCategoryJson) => { 
        return category.id === categoryID
      });
  
      if (categoryIndex == -1) {
        return false;
      };
  
      this.loadout.categories.splice(categoryIndex, 1);
      return true;
    },

    removeSubCategory (categoryID: string): boolean {
      if (!this.selectedItem) return false;

      const categoryIndex = this.selectedItem.categories.findIndex((category: ArsenalCategoryJson) => { 
        return category.id === categoryID
      });
  
      if (categoryIndex == -1) {
        return false;
      };
  
      this.loadout.categories.splice(categoryIndex, 1);
      return true;
    }
  }
})