import { createId } from "@paralleldrive/cuid2";
import type { ArsenalBuylistItem, ArsenalBuylistItemSerialized } from "./ArsenalBuylistItem.model";
import type { ArsenalUser, ArsenalUserSerialized } from "./ArsenalUser.model";
import type { ArsenalLoadoutSerialized } from "./ArsenalLoadout.model";

export enum ArsenalTagType {
    text,
    year,
    date
}

export interface ArsenalTagSerialized {
    label: string;
    type: ArsenalTagType;
    loadouts?: ArsenalLoadoutSerialized[] | string[];
}

interface ArsenalTagOptions {
    label: string;
    type: ArsenalTagType;
    loadouts?: ArsenalLoadout[] | string[];
}

export class ArsenalTag {
    label: string;
    type: ArsenalTagType;
    loadouts: ArsenalLoadout[] | string[] = [];

    constructor(tag: ArsenalTagOptions) {
        this.label = tag.label;
        this.type = tag.type;
        this.loadouts = tag.loadouts ?? [];
    }

    public serialize(): ArsenalTagSerialized {
        return '' as any;
    }
}