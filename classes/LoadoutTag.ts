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

  public constructor(label?: string, type?: LoadoutTagType) {
    if (label) {
      this.label = label;
    }

    if (type) {
      this.type = type;
    }
  }

  public get prettyLabel() {
    return `#${ this.label.replace('y:', '').replace('d:', '') }`
  }

  public get prettyType() {
    switch (this.type) {
      case LoadoutTagType.text:
        return 'Text'

      case LoadoutTagType.date:
        return 'Date';

      case LoadoutTagType.year:
        return 'Year';
      
      default:
        return 'Unknown';
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