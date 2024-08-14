import { defineStore } from 'pinia'
import { ArsenalLoadout, type ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { ArsenalItem, type ArsenalItemJson } from '~/classes/ArsenalItem';
import { ArsenalCategory, type ArsenalCategoryJson } from '~/classes/ArsenalCategory';
import { ArsenalMode } from '~/types/arsenal';

export const useArsenalStore = defineStore('arsenal', {
  state: () => {
    return {
      mode: ref<ArsenalMode> (ArsenalMode.view),
      loadout: ref<ArsenalLoadoutJson> (new ArsenalLoadout().toJSON()),
      selectedCategory: ref<ArsenalCategoryJson | null> (null),
      selectedItem: ref<ArsenalItemJson | null> (null),
      selectedSubCategory: ref<ArsenalCategoryJson | null> (null),
      selectedSubItem: ref<ArsenalItemJson | null> (null)
    }
  },
  getters: {
    getCategories: (state) => {
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
      const loadoutJson: ArsenalLoadoutJson | undefined = await $fetch(`/api/fetchLoadout/${ loadoutID }`)
      if (loadoutJson) {
        this.loadout = loadoutJson;
      };
    },
    setSelectedCategory (category: ArsenalCategory): void { this.selectedCategory = category },
    setSelectedSubCategory (category: ArsenalCategory): void { this.selectedSubCategory = category },
    setSelectedItem (item: ArsenalItem): void { this.selectedItem = item },
    setSelectedSubItem (item: ArsenalItem): void { this.selectedSubItem = item },

    addCategory (category: ArsenalCategory): void {
      this.loadout.categories.push(category);
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
    }
  }
})