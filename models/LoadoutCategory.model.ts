import { createId } from "@paralleldrive/cuid2";
import { ArsenalLoadout, type ArsenalLoadoutSerialized } from "./ArsenalLoadout.model";
import { LoadoutItem, type LoadoutItemSerialized } from "./LoadoutItem.model";
import ArsenalCategoryIcon from "@/content/categoryIcons.json";

/**
 * Type of loadout category
 * @readonly
 * @enum {number}
 */
export enum LoadoutCategoryType {
    /**
     * Main category (child of loadout)
     * @member {number}
     */
    main,
    /**
     * Sub category (child of item)
     * @member {number}
     */
    sub
}

/**
 * Loadout Category extended for use with raw database data
 */
interface LoadoutCategoryExtended extends LoadoutCategory {
    item_id?: string;
}

/**
 * Loadout Category serialized for storage
 */
export interface LoadoutCategorySerialized {
    id: string;
    parent: ArsenalLoadoutSerialized | LoadoutItemSerialized;
    loadout_id: string;
    type: number;
    position: number;
    icon: string;
    title: string;
}

/**
 * Class of a Kosher Arsenal Loadout Category
 * @param category A partial or complete loadout category to construct class from. Leave empty to create a new category.
 */
export class LoadoutCategory {
    public id: string;
    public parent?: ArsenalLoadout | LoadoutItem;
    public loadout_id: string;
    public type?: LoadoutCategoryType;
    public position: number;
    public icon: string;
    public title: string;
    public items?: LoadoutItem[];

    constructor (category?: Partial<LoadoutCategoryExtended> | string) {
        if (typeof category === 'string') {
            const fetchedCategory = this._fetchFromId(category);
            this.id = fetchedCategory?.id ?? createId();
            this.title = fetchedCategory?.title ?? 'New Category';
            this.position = fetchedCategory?.position ?? 0;
            this.icon = fetchedCategory?.icon ?? ArsenalCategoryIcon.unknown;
            this.loadout_id = fetchedCategory?.loadout_id ?? '';

            this._setParent(fetchedCategory?.parent);
        } else {
            this.id = category?.id ?? createId();
            this.title = category?.title ?? 'New Category';
            this.position = category?.position ?? 0;
            this.icon = category?.icon ?? ArsenalCategoryIcon.unknown;
            this.loadout_id = category?.loadout_id ?? '';

            this._setParent(category?.parent);
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
     * Fetch loadout category from API using the Category ID.
     * @param loadoutId ID of category to fetch
     * @private
     */
    private _fetchFromId (loadoutId: string): Partial<LoadoutCategory> {
        // @TODO Create fetch from ID function. Should update the API first.
        return new LoadoutCategory();
    }

    /**
     * Set the parent of this category
     * @param parent Loadout, Item or an ID of the parent
     * @private
     */
    private _setParent (parent?: ArsenalLoadout | LoadoutItem | string) {
        if (typeof parent === 'string') {
            try {
                this.parent = new ArsenalLoadout(parent);
            } catch {
                this.parent = new LoadoutItem(parent);
            }
        } else {
            this.parent = parent;

        }

        if (this.parent instanceof ArsenalLoadout) {
            this.type = LoadoutCategoryType.main;
        } else {
            this.type = LoadoutCategoryType.sub;
        }
    }
}