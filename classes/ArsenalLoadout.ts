import { createId } from '@paralleldrive/cuid2';
import { ArsenalPreviewImage, type ArsenalPreviewImageJson } from './ArsenalPreviewImage';
import { ArsenalCategory, type ArsenalCategoryJson } from './ArsenalCategory';
import { LoadoutCollection, type LoadoutCollectionJson } from './LoadoutCollection';
import { LoadoutTag, type LoadoutTagJson } from './LoadoutTag';

export enum LoadoutVisibility {
  public,
  unlisted,
  private
}

export declare interface ArsenalLoadoutJson {
  id: string,
  title: string,
  description: string,
  preview: ArsenalPreviewImageJson | ArsenalPreviewImage,
  tags: Array<LoadoutTagJson>,
  visibility: number,
  collections: Array<LoadoutCollectionJson>,
  categories: Array<ArsenalCategoryJson>
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

  public removeCategory(id: string): boolean {
    const categoryIndex = this.categories.findIndex((category: ArsenalCategory) => { category.id === id });

    if (categoryIndex == -1) {
      return false;
    };

    this.categories.splice(categoryIndex);
    return true;
  }

  public toJSON(): Object {
    const tags: Array<Object> = Array.from(this.tags.map((tag: LoadoutTag) => {
      return JSON.stringify(tag);
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

  public fromJSON(json: string): this {
    const data: ArsenalLoadoutJson = JSON.parse(json);
    const categories: Array<ArsenalCategoryJson> = data.categories;
    const collections: Array<LoadoutCollectionJson> = data.collections;
    const tags: Array<LoadoutTagJson> = data.tags;

    data.preview = new ArsenalPreviewImage().fromJSON(JSON.stringify(data.preview));

    data.categories = [];
    categories.forEach((categoryData: ArsenalCategoryJson) => {
      let category = new ArsenalCategory().fromJSON(JSON.stringify(categoryData));
      data.categories.push(category);
    });

    data.collections = [];
    collections.forEach((collectionData: LoadoutCollectionJson) => {
      let collection = new LoadoutCollection().fromJSON(JSON.stringify(collectionData));
      data.collections.push(collection);
    });

    data.tags = [];
    tags.forEach((tagData: LoadoutTagJson) => {
      let tag = new LoadoutTag().fromJSON(JSON.stringify(tagData));
      data.tags.push(tag);
    });

    Object.assign(this, data);
    return this;
  }
}