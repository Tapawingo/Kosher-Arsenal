import { D1Database } from "@nuxthub/core";
import { createId } from "@paralleldrive/cuid2";
import { ArsenalUserSerialized } from "~/models/ArsenalUser.model";

export default class LoadoutContributorRepository {
    private readonly db: D1Database;

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get all items from a category
     * @param itemId ID of category to fetch items for
     * @returns Array of items
     */
    async loadoutGetAll(loadoutId: string): Promise<ArsenalUserSerialized[]> {
        return (await this.db.prepare(`
            SELECT
                lc.user_id,
                u.username
            FROM loadout_contributor lc
            JOIN user u ON lc.user_id = u.id
            WHERE lc.loadout_id = ?1
        `).bind(
            loadoutId
        ).all<ArsenalUserSerialized>()).results;
    }

    /**
     * Add a contributor to a loadout
     * @param loadoutId ID of loadout to add contributor to
     * @param userId ID of user to add as a contributor
     */
    async add(loadoutId: string, userId: string): Promise<void> {
        await this.db.prepare(`
            INSERT INTO loadout_contributor (id, loadout_id, user_id)
            VALUES (?1, ?2, ?3)
        `).bind(
            createId(),
            loadoutId,
            userId
        ).run();
    }

    /**
     * Add multiple contributors to a loadout
     * @param loadoutId ID of loadout to add contributor to
     * @param users Array of Serialized Arsenal User Classes to add as a contributors
     */
    async addMultiple(loadoutId: string, users: ArsenalUserSerialized[]): Promise<void> {
        const values = users.map((user) => `(${ loadoutId }, ${ user.id })`);

        await this.db.prepare(`
            INSERT INTO loadout_contributor (loadout_id, user_id)
            VALUES ${ values.join(', ') }
        `).run();
    }

    /**
     * Remove a contributor from a loadout
     * @param loadoutId ID of loadout to remove contributor from
     * @param userId ID of user to remove
     */
    public async remove(loadoutId: string, userId: string): Promise<any> {
        return await this.db.prepare(`
            DELETE FROM loadout_contributor
            WHERE loadout_id = ?1 AND user_id = ?2
        `).bind(
            loadoutId,
            userId
        ).run();
    }

    /**
     * Creates table if it doesn't exist
     * @private
     */
    private _createTable() {
        try {
            this.db.prepare(`CREATE TABLE IF NOT EXISTS loadout_contributor (
                id TEXT PRIMARY KEY NOT NULL,
                loadout_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                FOREIGN KEY (loadout_id) REFERENCES loadout(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                UNIQUE (loadout_id, user_id)
            )`).run();
        } catch (e: any) {
            console.error(e);
            throw createError({
                message: 'Something went wrong',
                statusCode: 500
            });
        }
    }
}