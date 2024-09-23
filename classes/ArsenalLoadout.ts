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

export const visibility2String = (visibility: LoadoutVisibility): string => {
  switch (visibility) {
    case LoadoutVisibility.private: return 'Private';
    case LoadoutVisibility.unlisted: return 'Unlisted';
    case LoadoutVisibility.public: return 'Public';
    default: return 'Unknown';
  }
}

export const visibility2Icon = (visibility: LoadoutVisibility): string => {
  switch (visibility) {
    case LoadoutVisibility.private: return 'material-symbols:lock';
    case LoadoutVisibility.unlisted: return 'material-symbols:link';
    case LoadoutVisibility.public: return 'material-symbols:public';
    default: return 'material-symbols:indeterminate-question-box';
  }
}

export declare interface ArsenalLoadoutJson {
  id: string,
  title: string,
  description: string,
  owner: string,
  collaborators: Array<string>,
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

  public toJSON(): ArsenalLoadoutJson {
    const tags: Array<LoadoutTagJson> = Array.from(this.tags.map((tag: LoadoutTag) => {
      return tag.toJSON();
    }));

    const collections: Array<LoadoutCollectionJson> = this.collections.map((collection: LoadoutCollection) => {
      return collection.toJSON()
    });

    const categories: Array<ArsenalCategoryJson> = this.categories.map((category: ArsenalCategory) => {
      return category.toJSON();
    });

    const preview: ArsenalPreviewImageJson = this.preview.toJSON();

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      owner: this.owner,
      collaborators: this.collaborators,
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

  public fromDB(results: DatabaseLoadout): this {
    let dbTags = JSON.parse(results.tags);
    let dbCollections = JSON.parse(results.collections);
    let dbCategories = JSON.parse(results.categories);

    let collaborators = JSON.parse(results.collaborators);
    let preview = new ArsenalPreviewImage().fromJSON(results.preview);

    let collections: Array<LoadoutCollection> = [];
    dbCollections.forEach((collectionData: LoadoutCollectionJson) => {
      let collection = new LoadoutCollection().fromJSON(JSON.stringify(collectionData));
      collections.push(collection);
    });

    let tags: Array<LoadoutTag> = [];
    dbTags.forEach((tagData: LoadoutTagJson) => {
      let tag = new LoadoutTag().fromJSON(JSON.stringify(tagData));
      tags.push(tag);
    });

    let categories: Array<ArsenalCategory> = [];
    dbCategories.forEach((categoryData: ArsenalCategoryJson) => {
      let category = new ArsenalCategory().fromJSON(JSON.stringify(categoryData));
      categories.push(category);
    });

    Object.assign(this, {
      id: results.id,
      title: results.title,
      description: results.description,
      owner: results.owner,
      collaborators: collaborators,
      preview: preview,
      tags: tags,
      visibility: results.visibility,
      collections: collections,
      categories: categories
    });

    return this;
  }
}