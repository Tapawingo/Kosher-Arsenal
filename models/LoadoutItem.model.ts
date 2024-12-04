import { createId } from "@paralleldrive/cuid2";
import { LoadoutCategory, type LoadoutCategorySerialized } from "./LoadoutCategory.model";
import { LoadoutPreview, type LoadoutPreviewSerialized } from "./LoadoutPreview.model";

/**
 * Loadout item extended for use with raw database data
 */
interface LoadoutItemExtended extends LoadoutItem {
    category_id?: string;
}

/**
 * Loadout Item serialized for storage
 */
export interface LoadoutItemSerialized {
    id: string;
    parent: LoadoutCategorySerialized;
    loadout_id: string;
    position: number;
    title: string;
    description: string;
    preview: LoadoutPreviewSerialized;
}

/**
 * Class of a Kosher Arsenal Loadout Item
 * @param item A partial or complete loadout item to construct class from. Leave empty to create a new loadout item.
 */
export class LoadoutItem {
    id: string;
    parent!: LoadoutCategory | null;
    loadout_id: string;
    position: number;
    title: string;
    description: string;
    preview!: LoadoutPreview;

    constructor (item?: Partial<LoadoutItemExtended> | string) {
        if (typeof item === 'string') {
            const fetchedItem = this._fetchFromId(item);
            this.id = fetchedItem?.id ?? createId();
            this.title = fetchedItem?.title ?? 'New Category';
            this.position = fetchedItem?.position ?? 0;
            this.description = fetchedItem?.description ?? '';
            this.loadout_id = fetchedItem?.loadout_id ?? '';

            this._setPreview(fetchedItem?.preview);
            this._setParent(fetchedItem?.parent);
        } else {
            this.id = item?.id ?? createId();
            this.position = item?.position ?? 0;
            this.title = item?.title ?? 'New Item';
            this.description = item?.description ?? '';
            this.loadout_id = item?.loadout_id ?? '';
            
            this._setPreview(item?.preview);
            this._setParent(item?.parent);
        };
    }

    /**
     * Saves the loadout category to the database (or writes if it doesn't exist)
     * @returns True if save was successful or False if it failed
     * @async
     */
    public async save(): Promise<boolean> {
        // @TODO Create save function. Should update the API first.
        return false;
    }

    /**
     * Deletes the loadout category from the database
     * @returns True if save was successful or False if it failed
     * @async
     */
    public async delete(): Promise<boolean> {
        // @TODO Create delete function. Should update the API first.
        return false;
    }

    /**
     * Serializes Loadout (pure JSON object).
     * @returns Serialized loadout
     */
    public serialize () {
        // @TODO Create serialize function.
    };

    /**
     * Fetch item from API using item ID.
     * @param loadoutId ID of item to fetch
     * @returns Database Loadout data
     * @private
     */
    private _fetchFromId (itemId: string): Partial<LoadoutItem> {
        // @TODO Create fetch from ID function. Should update the API first.
        return new LoadoutItem();
    }

    /**
     * Sets the preview field
     * @param preview Loadout Preview Object
     * @private
     */
    private _setPreview(preview?: Partial<LoadoutPreview>) {
        if (preview) {
            this.preview = new LoadoutPreview(preview);
        } else {
            this.preview = new LoadoutPreview();
        }
    }

    /**
     * Set the parent of this item
     * @param parent Category or an ID of the category
     * @private
     */
    private _setParent (parent?: LoadoutCategory | null | string) {
        if (!parent) {
            this.parent = null
            return;
        }

        if (typeof parent === 'string') {
            this.parent = new LoadoutCategory(parent);
        } else {
            this.parent = parent;
        }
    }
}