import { createId } from '@paralleldrive/cuid2';

export declare interface LoadoutCollectionJson {
  id: string,
  title: string
}

export class LoadoutCollection {
  public id: string = createId();
  public title: string = '';

  public constructor(title?: string) {
    if (title) {
      this.title = title;
    }
  }

  public toJSON(): Object {
    return {
      id: this.id,
      title: this.title
    }
  }

  public fromJSON(json: string): this {
    const data: Object = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}