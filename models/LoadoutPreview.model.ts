
/**
 * The preview image type
 * @readonly
 * @enum {number}
 */
export enum ArsenalImageType {
    /** 
     * Background Image
     * @member {number} 
     */
    background,
    /** 
     * Foreground Figure 
     * @member {number}
     */
    figure,
    /** 
     * Reserved for future use.
     * @member {number} 
     * @todo
     */
    popout,
    /** 
     * Reserved for future use.
     * @member {number} 
     * @todo
     */
    icon
}

/**
 * Loadout Preview serialized for storage
 */
export interface LoadoutPreviewSerialized {
    type: number;
    path: string;
}

/**
 * Class of a Kosher Arsenal Loadout preview
 * @param preview A partial or complete loadout preview to construct class from. Leave empty to create a new loadout preview.
 */
export class LoadoutPreview {
    type: ArsenalImageType;
    path: string;

    constructor (preview?: Partial<LoadoutPreview>) {
        this.type = preview?.type ?? ArsenalImageType.figure;
        this.path = preview?.path ?? '';
    };

    /** 
     * Deletes Preview Image
     * @returns True if delete was successful
     */
    public async delete(): Promise<boolean> {
        // @TODO: Call preview delete API to delete from R2 bucket.
        return false;
    }

    /** 
     * Replaces Preview Image (and deletes old image from the bucket)
     * @param path Path to image location
     * @param type Preview Type
     * @returns True if replace was successful
     */
    public async replace(path: string, type: ArsenalImageType = ArsenalImageType.figure): Promise<boolean> {
        // @TODO: Call preview delete API to delete from R2 bucket.
        this.path = path ?? '';
        this.type = type;
        return false;
    }
}