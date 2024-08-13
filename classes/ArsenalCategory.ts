import { createId } from '@paralleldrive/cuid2';
import { ArsenalItem } from './ArsenalItem';
import type { ArsenalItemJson } from './ArsenalItem';

export enum ArsenalCategoryIcon {
  backpack = 'arsenal/icons/icon_backpack.svg',
  binoculars = 'arsenal/icons/icon_binoculars.svg',
  communication = 'arsenal/icons/icon_communication.svg',
  facewear = 'arsenal/icons/icon_facewear.svg',
  footwear = 'arsenal/icons/icon_footwear.svg',
  handwear = 'arsenal/icons/icon_handwear.svg',
  headgear = 'arsenal/icons/icon_headgear.svg',
  launcher = 'arsenal/icons/icon_launcher.svg',
  miscellaneous = 'arsenal/icons/icon_misc.svg',
  modification = 'arsenal/icons/icon_modification.svg',
  nvg = 'arsenal/icons/icon_nvg.svg',
  pants = 'arsenal/icons/icon_pants.svg',
  plus = 'arsenal/icons/icon_plus.svg',
  primary = 'arsenal/icons/icon_rifle.svg',
  secondary = 'arsenal/icons/icon_handgun.svg',
  torso = 'arsenal/icons/icon_torso.svg',
  unknown = 'arsenal/icons/icon_unknown.svg',
  vest = 'arsenal/icons/icon_vest.svg',
}

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
  public icon: ArsenalCategoryIcon = ArsenalCategoryIcon.unknown
  public title: string = '';
  public items: Array<ArsenalItem> = [];  

  public constructor(data: Partial<ArsenalCategory> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): Object {
    const items = this.items.map((item: ArsenalItem) => {
      return item.toJSON()
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