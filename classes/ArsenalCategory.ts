import { createId } from '@paralleldrive/cuid2';
import { ArsenalItem } from './ArsenalItem';
import type { ArsenalItemJson } from './ArsenalItem';

/* Add more icons:
  - Utility
  - Equipment
  - map
  
  sub icons
  - Stock
  - Pistol Grip
 */
export enum ArsenalCategoryIcon {
  primary = 'arsenal/icons/icon_rifle.svg',
  secondary = 'arsenal/icons/icon_handgun.svg',
  launcher = 'arsenal/icons/icon_launcher.svg',
  handweapon = 'arsenal/icons/icon_handweapon.svg',
  headgear = 'arsenal/icons/icon_headgear.svg',
  handwear = 'arsenal/icons/icon_handwear.svg',
  facewear = 'arsenal/icons/icon_facewear.svg',
  torso = 'arsenal/icons/icon_torso.svg',
  vest = 'arsenal/icons/icon_vest.svg',
  belt = 'arsenal/icons/icon_belt.svg',
  pants = 'arsenal/icons/icon_pants.svg',
  footwear = 'arsenal/icons/icon_footwear.svg',
  backpack = 'arsenal/icons/icon_backpack.svg',
  communication = 'arsenal/icons/icon_communication.svg',
  nvg = 'arsenal/icons/icon_nvg.svg',
  watch = 'arsenal/icons/icon_watch.svg',
  binoculars = 'arsenal/icons/icon_binoculars.svg',
  miscellaneous = 'arsenal/icons/icon_misc.svg',
  modification = 'arsenal/icons/icon_modification.svg',
  camo = 'arsenal/icons/icon_camo.svg',
  pouch = 'arsenal/icons/icon_pouch.svg',
  magazines = 'arsenal/icons/icon_magazines.svg',
  magazine = 'arsenal/icons/icon_magazine.svg',
  grip = 'arsenal/icons/icon_grip.svg',
  optic = 'arsenal/icons/icon_optic.svg',
  laser = 'arsenal/icons/icon_laser.svg',
  muzzle = 'arsenal/icons/icon_muzzle.svg',
  sling = 'arsenal/icons/icon_sling.svg',
  paint = 'arsenal/icons/icon_paint.svg',
  plus = 'arsenal/icons/icon_plus.svg',
  unknown = 'arsenal/icons/icon_unknown.svg',
  first = 'arsenal/icons/icon_first.svg',
  second = 'arsenal/icons/icon_second.svg',
  third = 'arsenal/icons/icon_third.svg',
  fourth = 'arsenal/icons/icon_fourth.svg',
  patch = 'arsenal/icons/icon_patch.svg',
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
  public icon: ArsenalCategoryIcon | string = ArsenalCategoryIcon.unknown
  public title: string = '';
  public items: Array<ArsenalItem> = [];  

  public constructor(data: Partial<ArsenalCategory> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): ArsenalCategoryJson {
    const items: Array<ArsenalItemJson> = this.items.map((item: ArsenalItem) => {
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