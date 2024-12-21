import { D1Database } from "@nuxthub/core";
import { createId } from "@paralleldrive/cuid2";
import { array, boolean, mixed, number, object, string, ValidationError } from "yup";
import { ArsenalBuylist, ArsenalBuylistSerialized } from "~/models/ArsenalBuylist.model";
import { ArsenalBuylistItemSerialized } from "~/models/ArsenalBuylistItem.model";
import { ArsenalLoadout } from "~/models/ArsenalLoadout.model";
import { ArsenalUser, ArsenalUserSerialized } from "~/models/ArsenalUser.model";
import { ArsenalUserProfile } from "~/models/ArsenalUserProfile.model";
import { LoadoutPreviewSerialized } from "~/models/LoadoutPreview.model";

interface ArsenalBuylistRaw extends ArsenalBuylistSerialized {
    user_id: string, 
    user_username: string, 
    user_avatar: string, 
    user_displayName: string,
    loadout_id: string;
    loadout_title: string;
    loadout_description: string;
    loadout_preview: string;
    loadout_visibility: number;
    loadout_owner: string;
}

export default class BuylistRepository {
    private readonly db: D1Database;

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get all buylists owner by user with ID
     * @param userId ID of user to get buylists for
     * @param limit The amount of buylists to fetch
     * @param offset The offset of pages to get
     * @param visibilities Array of visibilities to filter by
     * @returns An array of buylists
     */
    async getAllByUser(userId: string, limit = 10, offset = 0, visibilities = [0]): Promise<ArsenalBuylistSerialized[]> {
        const buylists = (await this.db.prepare(`
            SELECT
                buylist.id,
                buylist.visibility,
                buylist.created_at AS created,
                buylist.updated_at AS updated,
                user.id AS user_id,
                user.username AS user_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName,
                loadout.id AS loadout_id,
                loadout.title AS loadout_title,
                loadout.description AS loadout_description,
                loadout.preview AS loadout_preview,
                loadout.visibility AS loadout_visibility,
                loadout.owner AS loadout_owner
            FROM buylist
            JOIN user ON buylist.user_id = user.id
            JOIN user_profile ON buylist.user_id = user_profile.id
            JOIN loadout ON buylist.loadout_id = loadout.id
            WHERE buylist.user_id = ?1 AND buylist.visibility IN (${ visibilities.join(', ') })
            LIMIT ?2 OFFSET ?3
        `).bind(
            userId,
            limit,
            offset
        ).all<ArsenalBuylistRaw>()).results;

        /* Construct a valid ArsenalBuylist */
        return buylists.map((buylist) => {
            return {
                id: buylist.id,
                loadout: new ArsenalLoadout({
                    id: buylist.loadout_id,
                    title: buylist.loadout_title,
                    description: buylist.loadout_description,
                    preview: JSON.parse(buylist.loadout_preview) as LoadoutPreviewSerialized,
                    owner: buylist.loadout_owner,
                    visibility: buylist.loadout_visibility
                }).serialize(),
                visibility: buylist.visibility,
                created: buylist.created,
                updated: buylist.updated,
                items: [],
                user: new ArsenalUser({
                    id: buylist.user_id,
                    username: buylist.user_username,
                    profile: new ArsenalUserProfile({
                        userId: buylist.user_id,
                        username: buylist.user_username,
                        displayName: buylist.user_displayName,
                        avatar: buylist.user_avatar
                    })
                }).serialize()
            }
        });
    }

    /**
     * Get all buylists for a loadout
     * @param loadoutId ID of loadout to get buylists for
     * @param limit The amount of buylists to fetch
     * @param offset The offset of pages to get
     * @param visibilities Array of visibilities to filter by
     * @returns An array of buylists
     */
    async getAllByLoadout(loadoutId: string, limit = 10, offset = 0, visibilities = [0]): Promise<ArsenalBuylistSerialized[]> {
        const buylists = (await this.db.prepare(`
            SELECT
                buylist.id,
                buylist.loadout_id AS loadout,
                buylist.visibility,
                buylist.created_at AS created,
                buylist.updated_at AS updated,
                user.id AS user_id,
                user.username AS user_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName
            FROM buylist
            JOIN user on buylist.user_id = user.id
            JOIN user_profile on buylist.user_id = user_profile.id
            WHERE buylist.loadout_id = ?1 AND buylist.visibility IN (${ visibilities.join(', ') })
            LIMIT ?2 OFFSET ?3
        `).bind(
            loadoutId,
            limit,
            offset
        ).all<ArsenalBuylistRaw>()).results;

        /* Construct a valid ArsenalBuylist */
        return buylists.map((buylist) => {
            return {
                id: buylist.id,
                loadout: buylist.loadout,
                visibility: buylist.visibility,
                created: buylist.created,
                updated: buylist.updated,
                items: [],
                user: new ArsenalUser({
                    id: buylist.user_id,
                    username: buylist.user_username,
                    profile: new ArsenalUserProfile({
                        userId: buylist.user_id,
                        username: buylist.user_username,
                        displayName: buylist.user_displayName,
                        avatar: buylist.user_avatar
                    })
                }).serialize()
            }
        });
    }

    /**
     * Get buylist for a loadout for user by ID
     * @param userId ID of user to get buylist for
     * @param loadoutId ID of loadout to get buylist for
     * @returns A buylist
     */
    async getByLoadout(userId: string, loadoutId: string): Promise<ArsenalBuylistSerialized | null> {
        const buylist = await this.db.prepare(`
            SELECT
                buylist.id,
                buylist.loadout_id AS loadout,
                buylist.visibility,
                buylist.created_at AS created,
                buylist.updated_at AS updated,
                user.id AS user_id,
                user.username AS user_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName
            FROM buylist
            JOIN user on buylist.user_id = user.id
            JOIN user_profile on buylist.user_id = user_profile.id
            WHERE buylist.loadout_id = ?1 AND buylist.user_id = ?2
        `).bind(
            loadoutId,
            userId
        ).first<ArsenalBuylistRaw>();

        if (!buylist) return null;

        /* Construct a valid ArsenalBuylist */
        return {
            id: buylist.id,
            loadout: buylist.loadout,
            visibility: buylist.visibility,
            created: buylist.created,
            updated: buylist.updated,
            items: [],
            user: new ArsenalUser({
                id: buylist.user_id,
                username: buylist.user_username,
                profile: new ArsenalUserProfile({
                    userId: buylist.user_id,
                    username: buylist.user_username,
                    displayName: buylist.user_displayName,
                    avatar: buylist.user_avatar
                })
            }).serialize()
        }
    }

    /**
     * Get a buylist
     * @param buylistId ID of buylist
     * @returns A buylist
     */
    async getById(buylistId: string): Promise<ArsenalBuylistSerialized | null> {
        const buylist = await this.db.prepare(`
            SELECT
                buylist.id,
                buylist.loadout_id AS loadout,
                buylist.visibility,
                buylist.created_at AS created,
                buylist.updated_at AS updated,
                user.id AS user_id,
                user.username AS user_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName
            FROM buylist
            JOIN user on buylist.user_id = user.id
            JOIN user_profile on buylist.user_id = user_profile.id
            WHERE buylist.id = ?1
        `).bind(
            buylistId
        ).first<ArsenalBuylistRaw>();

        if (!buylist) return null;

        /* Construct a valid ArsenalBuylist */
        return {
            id: buylist.id,
            loadout: buylist.loadout,
            visibility: buylist.visibility,
            created: buylist.created,
            updated: buylist.updated,
            items: [],
            user: new ArsenalUser({
                id: buylist.user_id,
                username: buylist.user_username,
                profile: new ArsenalUserProfile({
                    userId: buylist.user_id,
                    username: buylist.user_username,
                    displayName: buylist.user_displayName,
                    avatar: buylist.user_avatar
                })
            }).serialize()
        }
    }

    async getItemById(userId: string, itemId: string): Promise<ArsenalBuylistItemSerialized | null> {
        return await this.db.prepare(`
            SELECT
                id,
                buylist_id AS buylistId,
                item_id AS itemId,
                owned,
                store,
                price,
                store_updated_at AS store_updated,
                price_updated_at AS price_updated
            FROM buylist_item
            WHERE user_id = ?1 AND item_id = ?2
        `).bind(
            userId,
            itemId
        ).first<ArsenalBuylistItemSerialized>();
    }

    /**
     * Update a buylist
     * @param buylistId ID of buylist to update 
     * @param buylist New buylist data
     */
    async updateBuylist(buylistId: string, buylist: ArsenalBuylistSerialized): Promise<any> {
        return await this.db.prepare(`
            UPDATE buylist
            SET visbility = ?2, updated_at = ?3
            WHERE id = ?1
        `).bind(
            buylistId,
            buylist.visibility,
            dateToSQL(new Date())
        ).run();
    }

    /**
     * Update a buylist item
     * @param buylistId ID of buylist to update item on
     * @param itemId ID of item to update
     * @param item New buylist item data
     */
    async updateItem(buylistId: string, itemId: string, item: ArsenalBuylistItemSerialized) {
        return await this.db.prepare(`
            INSERT INTO buylist_item (id, buylist_id, item_id, owned, store, price, store_updated_at, price_updated_at)
            VALUES(?8, ?2, ?1, ?3, ?4, ?5, ?6, ?7)
            ON CONFLICT(item_id, buylist_id) DO
            UPDATE SET owned = ?3, store = ?4, price = ?5, store_updated_at = ?6, price_updated_at = ?7
        `).bind(
            itemId,
            buylistId,
            item.owned,
            item.store,
            item.price,
            item.store_updated,
            item.price_updated,
            item.id
        ).run();
    }

    /**
     * Deletes buylist by ID
     * @param buylistId ID of buylist to delete
     */
    async deleteBuylist(buylistId: string) {
        await this.db.prepare(`DELETE FROM buylist where id = ?1`).bind(buylistId).run();
    }

    /**
     * Deletes a buylist item by buylist and item ID
     * @param buylistId ID of buylist item is affiliated
     * @param itemId ID of item to delete
     */
    async deleteItem(buylistId: string, itemId: string) {
        await this.db.prepare(`
            DELETE FROM buylist_item WHERE buylist_id = ?1 AND item_id = ?2
        `).bind(
            buylistId,
            itemId
        ).run();
    }

    /**
     * Checks if a user is authorized to make changes to the buylist
     * @param {string} buylistId ID of buylist to check
     * @param {string} userId ID of user to check
     * @returns {boolean} True if user is allowed
     */
    public async isEditAuthorized(buylistId: string, userId: string): Promise<boolean> {
        const loadout = await this.db.prepare(`
            SELECT
                owner
            FROM buylist
            WHERE id = ?1
        `).bind(
            buylistId
        ).first<{ owner: string }>();

        return loadout?.owner === userId;
    }

    /**
     * Checks if a user is authorized to delete the buylist
     * @param {string} buylistId ID of buylist to check
     * @param {string} userId ID of user to check
     * @returns {boolean} True if user is allowed
     */
    public async isDeleteAuthorized(buylistId: string, userId: string): Promise<boolean> {
        const loadout = await this.db.prepare(`
            SELECT
                owner
            FROM buylist
            WHERE id = ?1
        `).bind(
            buylistId
        ).first<{ owner: string }>();

        return loadout?.owner === userId;
    }

    /**
     * Checks to see if body is a valid item
     * @param body Buylist Item
     * @returns True if valid
     */
    async validateItemBody(body: any): Promise<boolean> {
        try {
            await object({
                id: string(),
                itemId: string().required('Missing Item ID'),
                buylistId: string().required('Missing Buylist ID'),
                owned: boolean(),
                store: string(),
                price: object({
                    amount: number().required('Price missing amount'),
                    currency: string().required('Price missing currency')
                }),
                store_updated: string().required('Missing store update datetime'),
                price_updated: string().required('Missing price update datetime')
            }).validate(body);

            return true;
          } catch (e: any) {
            console.warn(e);

            if (e instanceof ValidationError) {
                throw createError({
                    message: e.message,
                    statusCode: 400
                });
            } else {
                throw createError({
                    message: 'Something went wrong',
                    statusCode: 500
                });
            }
        }
    }

    /**
     * Checks to see if body is a valid buylist
     * @param body Buylist
     * @returns True if valid
     */
    async validateBuylistBody(body: any): Promise<boolean> {
        try {
            await object({
                id: string(),
                user: mixed(),
                loadout: mixed(),
                visibility: number().required('Missing visibility'),
                created: string(),
                updated: string(),
                items: array()
            }).validate(body);

            return true;
          } catch (e: any) {
            console.warn(e);

            if (e instanceof ValidationError) {
                throw createError({
                    message: e.message,
                    statusCode: 400
                });
            } else {
                throw createError({
                    message: 'Something went wrong',
                    statusCode: 500
                });
            }
        }
    }

    /**
     * Creates table if it doesn't exist
     * @private
     */
    private _createTable() {
        try {
            this.db.prepare(`
                CREATE TABLE IF NOT EXISTS buylist (
                    id TEXT PRIMARY KEY,
                    owner TEXT NOT NULL,
                    loadout_id TEXT NOT NULL,
                    visbility INT DEFAULT 2,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE,
                    FOREIGN KEY (loadout_id) REFERENCES loadout(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS buylist_item (
                    id TEXT NOT NULL PRIMARY KEY,
                    item_id TEXT NOT NULL,
                    buylist_id TEXT NOT NULL,
                    owned INT,
                    store TEXT,
                    price TEXT,
                    store_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    price_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (buylist_id) REFERENCES buylist(id) ON DELETE CASCADE,
                    FOREIGN KEY (item_id) REFERENCES loadout_item(id) ON DELETE CASCADE,
                    UNIQUE (loadout_id, buylist_id)
                );
            `).run();
        } catch (e: any) {
            console.error(e);
            throw createError({
                message: 'Something went wrong',
                statusCode: 500
            });
        }
    }
}