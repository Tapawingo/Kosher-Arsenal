import { createId } from '@paralleldrive/cuid2';
import type { ArsenalPreviewImage } from './ArsenalPreviewImage';
import type { ArsenalCategory } from './ArsenalCategory';
import type { LoadoutCollection } from './LoadoutCollection';

export enum LoadoutVisibility {
  public,
  unlisted,
  private
}

declare interface LoadoutTag {
  label: string;
}

export class ArsenalLoadout {
  public id: string = createId();
  public title: string = '';
  public description: string = '';
  public preview: ArsenalPreviewImage = new ArsenalPreviewImage();
  public owner: string = ''; // Replace with User Class Type in future
  public collaborators: Array<string> = []; // Replace with Array of User Class Types in future
  public tags: Array<LoadoutTag> = [];
  public visibility: LoadoutVisibility = LoadoutVisibility.public;
  public collections: Array<LoadoutCollection> = [];
  public categories: Array<ArsenalCategory> = [];

  public constructor(data: Partial<ArsenalLoadout> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): Object {
    const tags: Array<Object> = Array.from(this.tags.map((tag: LoadoutTag) => {
      return JSON.parse(`{ "label": ${ tag.label } }`);
    }));

    const collections = this.collections.map((collection: LoadoutCollection) => {
      return collection.toJSON()
    });

    const categories: Array<Object> = this.categories.map((category: ArsenalCategory) => {
      return category.toJSON();
    });

    const preview: Object = this.preview.toJSON();

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      preview: preview,
      tags: tags,
      visibility: this.visibility,
      collections: collections,
      categories: categories
    }
  }

  public fromJSON(json: String): ArsenalLoadout {
    const data: Object = JSON.parse(json);
    const categories: Array<Object> = data.categories;
    const collections: Array<Object> = data.collections;

    data.preview = new ArsenalPreviewImage().fromJSON(data.preview);

    data.categories = [];
    categories.forEach((categoryData: Object) => {
      let category = new ArsenalCategory().fromJSON(JSON.stringify(categoryData));
      data.categories.push(category);
    });

    data.collections = [];
    collections.forEach((collectionData: Object) => {
      let collection = new LoadoutCollection().fromJSON(JSON.stringify(collectionData));
      data.collections.push(collection);
    });

    Object.assign(this, data);
    return this;
  }
}