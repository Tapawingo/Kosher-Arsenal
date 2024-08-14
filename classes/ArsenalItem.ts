import { createId } from '@paralleldrive/cuid2';
import { ArsenalCategory } from "./ArsenalCategory";
import type { ArsenalCategoryJson } from "./ArsenalCategory";
import { ArsenalPreviewImage } from "./ArsenalPreviewImage";
import type { ArsenalPreviewImageJson } from "./ArsenalPreviewImage";

export declare interface ArsenalItemJson {
  id: string,
  position: number,
  title: string,
  description: string,
  preview: ArsenalPreviewImageJson | ArsenalPreviewImage,
  categories: Array<ArsenalCategoryJson | ArsenalCategory>
}

export class ArsenalItem {
  public id: string = createId();
  public position: number = 0;
  public title: string = '';
  public description: string = '';
  public preview: ArsenalPreviewImage = new ArsenalPreviewImage();
  public categories: Array<ArsenalCategory> = [];
  
  public constructor(data: Partial<ArsenalItem> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): ArsenalItemJson {
    const categories: Array<ArsenalCategoryJson> = this.categories.map((category: ArsenalCategory) => {
      return category.toJSON();
    });

    const preview: ArsenalPreviewImageJson = this.preview.toJSON();

    return {
      id: this.id,
      position: this.position,
      title: this.title,
      description: this.description,
      preview: preview,
      categories: categories
    }
  }

  public fromJSON(json: string): this {
    const data: ArsenalItemJson = JSON.parse(json);
    const categories: Array<ArsenalCategoryJson> = data.categories as Array<ArsenalCategoryJson>;

    data.preview = new ArsenalPreviewImage().fromJSON(JSON.stringify(data.preview));

    data.categories = [];
    categories.forEach((categoryData: Object) => {
      let category = new ArsenalCategory().fromJSON(JSON.stringify(categoryData));
      data.categories.push(category);
    })

    Object.assign(this, data);
    return this;
  }
}