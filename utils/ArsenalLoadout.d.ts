import { createId } from '@paralleldrive/cuid2';
import type { ArsenalPreviewImage } from './ArsenalPreviewImage';
import type { ArsenalCategory } from './ArsenalCategory';

export enum LoadoutVisibility {
  public,
  unlisted,
  private
}

declare interface LoadoutTag {
  name: string;
}

declare interface LoadoutCollection {
  name: string;
  loadouts: Array<ArsenalLoadout>
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
}