import { defineStore } from 'pinia'
import { ArsenalLoadout, type ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { type ArsenalItemJson } from '~/classes/ArsenalItem';
import { type ArsenalCategoryJson } from '~/classes/ArsenalCategory';

export enum ArsenalMode {
  view,
  edit,
  buylist
}

export enum ArsenalStates {
  loading,
  ready,
  error
}

declare interface ItemPrice {
  price: number;
  currency: string;
}
declare interface BuyListItem {
  itemID: string;
  purchased: boolean;
  storeLink: string;
  price: ItemPrice;
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
      selectedSubItem: ref<ArsenalItemJson | null> (null),
      buyListItems: ref<Array<BuyListItem>> ([])
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

    addCategory (category: ArsenalCategoryJson): boolean {
      const index = this.loadout.categories.push(category) - 1;
      category.position = index;

      return true;
    },

    addSubCategory (category: ArsenalCategoryJson): boolean {
      if (!this.selectedItem) return false;

      const index = this.selectedItem.categories.push(category) - 1;
      category.position = index;

      return true;
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
  
      this.selectedItem.categories.splice(categoryIndex, 1);
      return true;
    },

    addItem (item: ArsenalItemJson): boolean {
      if (!this.selectedCategory) return false;

      const index = this.selectedCategory.items.push(item) - 1;
      item.position = index;

      return true;
    },

    addSubItem (item: ArsenalItemJson): boolean {
      if (!this.selectedSubCategory) return false;

      const index = this.selectedSubCategory.items.push(item) - 1;
      item.position = index;

      return true;
    },

    removeItem (itemID: string): boolean {
      if (!this.selectedCategory) return false;

      const itemIndex = this.selectedCategory.items.findIndex((item: ArsenalItemJson) => { 
        return item.id === itemID
      });
  
      if (itemIndex == -1) {
        return false;
      };
  
      this.selectedCategory.items.splice(itemIndex, 1);
      return true;
    },

    removeSubItem (itemID: string): boolean {
      if (!this.selectedSubCategory) return false;

      const itemIndex = this.selectedSubCategory.items.findIndex((item: ArsenalItemJson) => { 
        return item.id === itemID
      });
  
      if (itemIndex == -1) {
        return false;
      };
  
      this.selectedSubCategory.items.splice(itemIndex, 1);
      return true;
    },

    getBuylistItem (itemID: string): BuyListItem | void {
      const itemIndex = this.buyListItems.findIndex((item: BuyListItem) => { 
        return item.itemID === itemID
      });

      if (itemIndex) {
        return this.buyListItems[itemIndex];
      }
    }
  }
})