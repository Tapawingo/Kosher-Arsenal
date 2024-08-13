import { createId } from '@paralleldrive/cuid2';
import type { ArsenalCategory } from "./ArsenalCategory";
import type { ArsenalPreviewImage } from "./ArsenalPreviewImage";

export class ArsenalItem {
  public id: string = createId();
  public position: Number = 0;
  public title: String = '';
  public description: String = '';
  public preview: ArsenalPreviewImage = new ArsenalPreviewImage();
  public categories: Array<ArsenalCategory> = [];
  
  public constructor(data: Partial<ArsenalItem> = {}) {
    Object.assign(this, data);
  }
}