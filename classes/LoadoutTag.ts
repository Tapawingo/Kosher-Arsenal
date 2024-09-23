export enum LoadoutTagType {
  text,
  year,
  date
}

export declare interface LoadoutTagJson {
  label: string;
  type: number;
}

export class LoadoutTag {
  public label: string = '';
  public type: LoadoutTagType = LoadoutTagType.text;

  public constructor(label?: string) {
    if (label) {
      this.label = label;
    }
  }

  public toJSON(): LoadoutTagJson {
    return {
      label: this.label,
      type: this.type
    }
  }

  public fromJSON(json: string): this {
    const data: LoadoutTagJson = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}