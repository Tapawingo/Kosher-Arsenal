export enum ArsenalImageType {
  background,
  figure
}

export declare interface ArsenalPreviewImageJson {
  type: number,
  path: string
}

export class ArsenalPreviewImage {
  public type: ArsenalImageType = ArsenalImageType.figure;
  public path: string = '';

  public constructor(data: Partial<ArsenalPreviewImage> = {}) {
    Object.assign(this, data);
  }

  public toJSON(): ArsenalPreviewImageJson {
    return {
      type: this.type,
      path: this.path
    }
  }

  public fromJSON(json: string): this {
    const data: Object = JSON.parse(json);

    Object.assign(this, data);
    return this;
  }
}