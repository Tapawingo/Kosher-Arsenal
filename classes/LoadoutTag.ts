export enum LoadoutTagType {
  text,
  year,
  date
}

export declare interface LoadoutTagJson {
  label: string;
  type: number;
  loadouts: string[];
}

export class LoadoutTag {
  public label: string = '';
  public type: LoadoutTagType = LoadoutTagType.text;
  public loadouts: string[] = [];

  public constructor(label?: string) {
    if (label) {
      this.label = label;
    }
  }

  public get prettyLabel() {
    return `#${ this.label.replace('y:', '').replace('d:', '') }`
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