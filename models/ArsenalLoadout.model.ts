import { createId } from "@paralleldrive/cuid2";
import { ArsenalUser, type ArsenalUserSerialized } from "./ArsenalUser.model";
import { LoadoutCategory, type LoadoutCategorySerialized } from "./LoadoutCategory.model";
import { LoadoutPreview, type LoadoutPreviewSerialized } from "./LoadoutPreview.model";

/**
 * A loadouts visibility
 * @readonly
 * @enum {number}
 */
export enum ArsenalLoadoutVisibility {
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

/**
 * ArsenalLoadout serialized for storage
 */
export interface ArsenalLoadoutSerialized {
    id: string;
    title: string;
    description: string;
    preview: LoadoutPreviewSerialized;
    owner: string;
    visibility: number;
    created_at: string;
    updated_at: string;
    categories?: LoadoutCategorySerialized[];
    contributors?: ArsenalUserSerialized[];
}

/**
 * Loadout extended for use with raw database data
 */
interface ArsenalLoadoutExtended extends ArsenalLoadout {
    owner_id: string;
    owner_username: string;
    owner_email: string;
    owner_email_verified: number;
}

/**
 * Class of a Kosher Arsenal Loadout
 * @param loadout A partial or complete loadout to construct class from. Leave empty to create a new loadout.
 */
export class ArsenalLoadout {
    public id: string;
    public title: string;
    public description: string;
    public preview!: LoadoutPreview;
    public owner!: ArsenalUser;
    public visibility: ArsenalLoadoutVisibility;
    public created_at!: Date;
    public updated_at!: Date;
    public categories!: LoadoutCategory[];
    public contributors!: ArsenalUser[];

    public constructor (loadout?: Partial<ArsenalLoadoutExtended> | Omit<Partial<ArsenalLoadoutExtended>, 'preview'> & { 
        preview: Partial<LoadoutPreview>
    } | string) {
        if (typeof loadout === 'string') {
            const fetchedLoadout = this._fetchFromId(loadout);
        } else {
            this.id = loadout?.id ?? createId();
            this.title = loadout?.title ?? 'New Loadout';
            this.description = loadout?.description ?? '';
            this.visibility = loadout?.visibility ?? ArsenalLoadoutVisibility.public;
    
            this._setOwner(loadout);
            this._setPreview(loadout?.preview);
            this._setCreatedAt(loadout?.created_at);
            this._setUpdatedAt(loadout?.updated_at);
            this._setCategories(loadout?.categories);
            this._setContributors(loadout?.contributors);
        };
    };

    /**
     * Saves the loadout to the database (or writes if it doesn't exist)
     * @returns True if save was successful or False if it failed
     * @async
     */
    public async save(): Promise<boolean> {
        // @TODO Create save function. Should update the API first.
        return false;
    }

    /**
     * Deletes the loadout from the database
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
     * Fetch loadout from API using loadout ID.
     * @param loadoutId ID of loadout to fetch
     * @private
     */
    private _fetchFromId (loadoutId: string) {
        // @TODO Create fetch from ID function. Should update the API first.
        $fetch(`/api/v2/loadouts/${ loadoutId }`, {
            method: 'GET'
        }).then((loadout) => {
            this.id = loadout?.id ?? createId();
            this.title = loadout?.title ?? 'New Loadout';
            this.description = loadout?.description ?? '';
            this.visibility = loadout?.visibility ?? ArsenalLoadoutVisibility.public;

            this._setOwner(loadout);
            this._setPreview(loadout?.preview);
            this._setCreatedAt(loadout?.created_at);
            this._setUpdatedAt(loadout?.updated_at);
            this._setCategories(loadout?.categories);
            this._setContributors(loadout?.contributors);
        });
    }

    /**
     * Sets the owner of the loadout
     * @param userData Data of user
     * @private
     */
    private _setOwner(loadoutData?: Partial<ArsenalLoadoutExtended> | Omit<Partial<ArsenalLoadoutExtended>, 'preview'> & { 
        preview: Partial<LoadoutPreview>
    }) {
        if (loadoutData?.owner && loadoutData.owner instanceof ArsenalUser) {
            this.owner = loadoutData.owner;
        } else if (loadoutData?.owner) {
            this.owner = new ArsenalUser(loadoutData.owner);
        } else if (loadoutData?.owner_id && loadoutData.owner_username && loadoutData.owner_email && loadoutData.owner_email_verified) {
            this.owner = new ArsenalUser({
                id: loadoutData.owner_id,
                username: loadoutData.owner_username,
                email: loadoutData.owner_email,
                emailVerified: loadoutData.owner_email_verified
            });
        } else {
            const user = useUser();
            if (!user.value) throw Error('Missing Owner!');
            this.owner = new ArsenalUser(user.value);
        }
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
     * Sets the created_at field
     * @param created_at Date or date string
     * @private
     */
    private _setCreatedAt (created_at?: Date | string) {
        if (created_at) {
            this.created_at = created_at instanceof Date ? created_at : new Date(created_at);
        } else {
            this.created_at = new Date();
        }
    }

    /**
     * Sets the updated_at field
     * @param updated_at Date or date string
     * @private
     */
    private _setUpdatedAt (updated_at?: Date | string) {
        if (updated_at) {
            this.updated_at = updated_at instanceof Date ? updated_at : new Date(updated_at);
        } else {
            this.updated_at = new Date();
        }
    }

    /**
     * Create list of categories
     * @param categories List of categories or category IDs
     * @private
     */
    private _setCategories (categories?: Partial<LoadoutCategory>[] | string[]) {
        if (categories) {
            this.categories = categories.map((category) => {
                return new LoadoutCategory(category);
            });
        } else {
            this.categories = [];
        };
    }

    /**
     * Create list of contributors
     * @param categories List of contributors or contributor IDs
     * @private
     */
    private _setContributors (contributors?: ArsenalUser[] | string[]) {
        if (contributors) {
            this.contributors = contributors.map((contributor) => {
                return new ArsenalUser(contributor);
            });
        } else {
            this.contributors = [];
        };
    }
}

/**
 * @param visibility The visibility value to beautify
 * @returns Returns a beautified string of the visibility
 */
export const visibility2String = (visibility: LoadoutVisibility): string => {
    switch (visibility) {
        case LoadoutVisibility.private: return 'Private';
        case LoadoutVisibility.unlisted: return 'Unlisted';
        case LoadoutVisibility.public: return 'Public';
        default: return 'Unknown';
    }
}

/**
 * @param visibility The visibility value
 * @returns Returns a icones.js icon representing the visibility
 */
export const visibility2Icon = (visibility: LoadoutVisibility): string => {
    switch (visibility) {
        case LoadoutVisibility.private: return 'material-symbols:lock';
        case LoadoutVisibility.unlisted: return 'material-symbols:link';
        case LoadoutVisibility.public: return 'material-symbols:public';
        default: return 'material-symbols:indeterminate-question-box';
    }
}