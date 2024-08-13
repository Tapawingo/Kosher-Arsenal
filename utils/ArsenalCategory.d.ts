import { createId } from '@paralleldrive/cuid2';
import type { ArsenalItem } from './ArsenalItem';

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

export class ArsenalCategory {
  public id: String = createId();
  public position: Number = 0;
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
  
  public fromJSON(json: String): ArsenalCategory {
    const data: Object = JSON.parse(json);
    const items: Array<Object> = data.items;

    data.items = [];
    items.forEach((itemData: Object) => {
      let item = new ArsenalItem().fromJSON(JSON.stringify(itemData));
      data.items.push(item);
    });

    Object.assign(this, data)
    return this;
  }
}