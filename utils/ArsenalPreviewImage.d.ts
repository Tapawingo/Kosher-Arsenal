export enum ArsenalImageType {
  background,
  figure
}

export class ArsenalPreviewImage {
  /** Type of preview image (background | figure) */
  public type: ArsenalImageType = ArsenalImageType.figure;
  /** Path to image */
  public path: string = '';
  /** Alternate text */
  public alt: string = 'Preview Image';

  public constructor(data: Partial<ArsenalPreviewImage> = {}) {
    Object.assign(this, data);
  }
}