import { createId } from "@paralleldrive/cuid2";
import type { ArsenalBuylistItem, ArsenalBuylistItemSerialized } from "./ArsenalBuylistItem.model";
import type { ArsenalUser, ArsenalUserSerialized } from "./ArsenalUser.model";
import type { ArsenalLoadoutSerialized } from "./ArsenalLoadout.model";

/**
 * A buylist's visibility
 * @readonly
 * @enum {number}
 */
export enum ArsenalBuylistVisibility {
    /** 
     * The loadout is visible to everyone
     * @member {number} 
     */
    public,
    /** 
     * The loadout is visible only to those with a direct link
     * @member {number} 
     */
    unlisted,
    /** 
     * The loadout is visible only to the owner and contributors
     * @member {number} 
     */
    private
}

export interface ArsenalBuylistSerialized {
    id: string;
    user: ArsenalUserSerialized;
    loadout: ArsenalLoadoutSerialized;
    visibility: ArsenalBuylistVisibility;
    created: string;
    updated: string;
    items: ArsenalBuylistItemSerialized[]
}

interface ArsenalBuylistOptions {
    id?: string;
    user: string | ArsenalUser;
    loadout: string | ArsenalLoadout;
    visibility?: ArsenalBuylistVisibility;
    items?: Array<ArsenalBuylistItem | ArsenalBuylistItemSerialized>;
    created?: string;
    updated?: string;
}

export class ArsenalBuylist {
    id!: string;
    user!: ArsenalUser;
    loadout!: ArsenalLoadout | string;
    visibility!: ArsenalBuylistVisibility;
    items?: ArsenalBuylistItem[];
    created: string;
    updated: string;

    constructor(buylist: ArsenalBuylistOptions | string) {
        if (typeof buylist === 'string') {
            this._fetchFromId(buylist);
        } else {
            this.id = buylist.id ?? createId();
            this.user = buylist.user; // @TODO Set user from id string
            this.loadout = buylist.loadout;
            this.visibility = buylist.visibility ?? ArsenalBuylistVisibility.private;
        };
    }

    private _fetchFromId(buylistId: string) {
        /* fetch ID then set values */
        const placeholderBuylist: any = '';

        this.id = placeholderBuylist.id;
        this.userId = placeholderBuylist.userId;
        this.loadoutId = placeholderBuylist.loadoutId;
        this.visibility = placeholderBuylist.visibility;
    }

    public serialize(): ArsenalBuylistSerialized {
        return '' as any;
    }
}