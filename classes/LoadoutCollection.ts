import { createId } from '@paralleldrive/cuid2';

export declare interface LoadoutCollectionJson {
  id: string,
  title: string,
  preview: string,
  loadouts: Array<string>
}

export class LoadoutCollection {
  public id: string = createId();
  public title: string = '';
  public preview: string = '';
  public loadouts: Array<string> = [];

  public constructor(title?: string) {
    if (title) {
      this.title = title;
    }
  }

  public toJSON(): LoadoutCollectionJson {
    return {
      id: this.id,
      title: this.title,
      preview: this.preview,
      loadouts: this.loadouts
    }
  }

  public fromJSON(json: string): this {
    const data: Object = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}