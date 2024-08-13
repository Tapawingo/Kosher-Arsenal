export enum ArsenalImageType {
  background,
  figure
}

export class ArsenalPreviewImage {
  public type: ArsenalImageType = ArsenalImageType.figure;
  public path: string = '';
  public alt: string = 'Preview Image';

  public constructor(data: Partial<ArsenalPreviewImage> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): Object {
    return {
      type: this.type,
      path: this.path,
      alt: this.alt
    }
  }

  public fromJSON(json: String): ArsenalPreviewImage {
    const data: Object = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}