import { createId } from '@paralleldrive/cuid2';
import type { ArsenalLoadout } from './ArsenalLoadout';

export class LoadoutCollection {
  public id: string = createId();
  public title: string = '';

  public constructor(title: string) {
    this.title = title;
  }

  public toJSON(): Object {
    return {
      id: this.id,
      title: this.title
    }
  }

  public fromJSON(json: string): LoadoutCollection {
    const data: Object = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}