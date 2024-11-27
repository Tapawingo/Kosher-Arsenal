import { createId } from '@paralleldrive/cuid2';
import { ArsenalItem } from './ArsenalItem';
import type { ArsenalItemJson } from './ArsenalItem';
import ArsenalCategoryIcon from "@/content/categoryIcons.json";

/* Add more icons:
  - Utility
  - Equipment
  - map
  
  sub icons
  - Stock
  - Pistol Grip
 */

export declare interface ArsenalCategoryJson {
  id: string,
  position: number,
  icon: string,
  title: string,
  items: Array<ArsenalItemJson | ArsenalItem>
}

export class ArsenalCategory {
  public id: string = createId();
  public position: number = 0;
  public icon: string = ArsenalCategoryIcon.unknown
  public title: string = '';
  public items: Array<ArsenalItem> = [];  

  public constructor(data: Partial<ArsenalCategory> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): ArsenalCategoryJson {
    const items: Array<ArsenalItemJson> = this.items.map((item: ArsenalItem) => {
      if (item.toJSON) {
        return item.toJSON();
      } else {
        return item;
      }
    });

    return {
      id: this.id,
      position: this.position,
      icon: this.icon,
      title: this.title,
      items: items
    }
  }
  
  public fromJSON(json: string): this {
    const data: ArsenalCategoryJson = JSON.parse(json);
    const items: Array<ArsenalItemJson> = data.items as Array<ArsenalItemJson>;

    data.items = [];
    items.forEach((itemData: ArsenalItemJson) => {
      let item = new ArsenalItem().fromJSON(JSON.stringify(itemData));
      data.items.push(item);
    });

    Object.assign(this, data)
    return this;
  }
}