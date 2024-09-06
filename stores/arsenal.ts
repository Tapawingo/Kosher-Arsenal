import { defineStore } from 'pinia'
import { ArsenalLoadout, LoadoutVisibility, type ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { type ArsenalItemJson } from '~/classes/ArsenalItem';
import { type ArsenalCategoryJson } from '~/classes/ArsenalCategory';
import type { DatabaseBuylistItem } from '~/server/utils/db';

export enum ArsenalMode {
  view,
  buylist,
  edit
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
  user_id: string;
  loadout_id: string;
  item_id: string;
  owned: boolean;
  store: string;
  price: ItemPrice;
}

const arsenalEvents: { id: Number, event: string, callback: Function }[] = [];

export const useArsenalStore = defineStore('arsenal', {
  state: () => {
    return {
      mode: ref<ArsenalMode> (ArsenalMode.view),
      arsenalState: ref<ArsenalStates> (ArsenalStates.loading),
      stateMessage: ref<undefined | string> (),
      loadout: ref<ArsenalLoadoutJson> (new ArsenalLoadout().toJSON()),
      buylist: ref<BuyListItem[]> ([]),
      selectedCategory: ref<ArsenalCategoryJson | null> (null),
      selectedItem: ref<ArsenalItemJson | null> (null),
      selectedSubCategory: ref<ArsenalCategoryJson | null> (null),
      selectedSubItem: ref<ArsenalItemJson | null> (null),
      buyListItems: ref<Array<BuyListItem>> ([]),
      clipboard: ref<ArsenalItemJson | null> (null),
      eventCounter: ref<number> (0)
    }
  },
  getters: {
    getCategories: (state): Array<ArsenalCategoryJson> => {
      const categories = state.loadout.categories;
      categories.sort((a: ArsenalCategoryJson, b: ArsenalCategoryJson) => {
        return a.position - b.position;
      })

      return categories;
    },
  },
  actions: {
    on (event: string, callback: Function): number {
      this.eventCounter++;

      arsenalEvents.push({
        id: this.eventCounter,
        event: event,
        callback: callback
      });

      return this.eventCounter;
    },

    trigger (eventTrigger: string, args: object): void {
      arsenalEvents.forEach((event) => {
        if (event.event === eventTrigger) {
          event.callback(args);
        }
      });
    },

    removeEvent (eventId: number): boolean {
      const categoryIndex = arsenalEvents.findIndex((event) => {
        return event.id === eventId
      });
  
      if (categoryIndex == -1) {
        return false;
      };
  
      arsenalEvents.splice(categoryIndex, 1);

      return true;
    },

    setMode (mode: ArsenalMode): void { 
      let oldMode = this.mode;
      this.mode = mode;
      this.trigger('onChangeMode', {
        new: mode,
        old: oldMode
      });
    },

    isPreviewMode(): boolean {
      return this.mode === ArsenalMode.view
    },

    isBuylistMode(): boolean {
      return this.mode === ArsenalMode.buylist
    },

    isEditMode(): boolean {
      return this.mode === ArsenalMode.edit
    },

    async fetchLoadout (loadoutID: string) { 
      this.arsenalState = ArsenalStates.loading;

      try {
        const loadoutJson: any = await $fetch(`/api/loadout/${ loadoutID }`);

        if (loadoutJson) {
          this.loadout = loadoutJson;
          this.arsenalState = ArsenalStates.ready;
        } else {
          this.arsenalState = ArsenalStates.error;
          this.stateMessage = 'Loadout not found';
        };

        this.trigger('onLoadoutFetched', {});
      } catch (e: any) {
        this.arsenalState = ArsenalStates.error;
        this.stateMessage = e.message;
      }

    },

    async fetchBuylist () {
      this.arsenalState = ArsenalStates.loading;

      try {
        const buylist: any = await $fetch(`/api/buylist/getLoadout`, {
          method: "POST",
          body: {
            loadoutId: this.loadout.id
          }
        });

        if (buylist) {
          this.buylist = buylist;
          this.arsenalState = ArsenalStates.ready;
        } else {
          this.buylist = [];
        }

        this.trigger('onBuylistFetched', {});
      } catch (e: any) {
        this.buylist = [];
        this.arsenalState = ArsenalStates.ready;
      }
    },

    async saveLoadout(): Promise<boolean> {
      const user = useUser();
      const toast = useToast();

      if (user.value?.id !== this.loadout.owner) return false;

      try {
        await $fetch(`/api/loadout/${ this.loadout.id }`, {
          method: "POST",
          body: { data: this.loadout }
        });
      } catch (e: any) {
        toast.add({
          title: 'Error',
          description: `Save failed: ${ e.message }`,
          color: 'red'
        });

        return false;
      }

      return true;
    },

    resetState(): void {
      this.selectedCategory = null;
      this.selectedItem = null;
      this.selectedSubCategory = null;
      this.selectedSubItem = null;
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

    getBuylistItem (itemID: string): BuyListItem {
      const user = useUser();
      const buylistData = this.buylist.find((buylistItem) => {
        return buylistItem.item_id === itemID
      });

      return buylistData ? buylistData : {
        user_id: user.value ? user.value.id : '',
        loadout_id: this.loadout.id,
        item_id: itemID,
        owned: false,
        store: '',
        price: { price: 0, currency: '' }
      };
    },

    async setBuylistItem (buylistItem: BuyListItem): Promise<void> {
      const toast = useToast();
      try {
        await $fetch('/api/buylist/set', {
          method: "POST",
          body: {
            loadoutId: this.loadout.id,
            itemId: buylistItem.item_id,
            owned: buylistItem.owned,
            store: buylistItem.store,
            price: buylistItem.price
          }
        });

        // console.log(buylistItem);

        let listIndex = this.buylist.findIndex((buylistItem) => buylistItem.item_id == buylistItem.item_id);
        if (listIndex === -1) {
          this.buylist.push(buylistItem);
        } else {
          this.buylist[listIndex] = buylistItem;
        };

        console.log(this.buylist);
      } catch (e: any) {
        toast.add({
          title: 'Error',
          description: e.message,
          color: 'red'
        });
      }
    }
  }
})