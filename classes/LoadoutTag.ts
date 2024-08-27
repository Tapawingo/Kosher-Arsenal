export enum LoadoutTagType {
  text,
  date
}

export declare interface LoadoutTagJson {
  label: string;
  type: number;
  loadouts: Array<string>;
}

export class LoadoutTag {
  public label: string = '';
  public type: LoadoutTagType = LoadoutTagType.text;
  public loadouts: Array<string> = [];

  public constructor(label?: string) {
    if (label) {
      this.label = label;
    }
  }

  public toJSON(): LoadoutTagJson {
    return {
      label: this.label,
      type: this.type,
      loadouts: this.loadouts
    }
  }

  public fromJSON(json: string): this {
    const data: LoadoutTagJson = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}