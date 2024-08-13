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

  public toJSON(): Object {
    const categories: Array<Object> = this.categories.map((category: ArsenalCategory) => {
      return category.toJSON();
    });

    const preview: Object = this.preview.toJSON();

    return {
      id: this.id,
      position: this.position,
      title: this.title,
      description: this.description,
      preview: preview,
      categories: categories
    }
  }

  public fromJSON(json: String): ArsenalItem {
    const data: Object = JSON.parse(json);
    const categories: Array<Object> = data.categories;

    data.preview = new ArsenalPreviewImage().fromJSON(data.preview);

    data.categories = [];
    categories.forEach((categoryData: Object) => {
      let category = new ArsenalCategory().fromJSON(JSON.stringify(categoryData));
      data.categories.push(category);
    })

    Object.assign(this, data);
    return this;
  }
}