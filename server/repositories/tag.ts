import { D1Database } from "@nuxthub/core";
import { createId } from "@paralleldrive/cuid2";
import { ArsenalLoadoutSerialized } from "~/models/ArsenalLoadout.model";
import { ArsenalUser } from "~/models/ArsenalUser.model";
import { ArsenalLoadoutRaw } from "./loadout";
import { LoadoutPreview } from "~/models/LoadoutPreview.model";
import { ArsenalUserProfile } from "~/models/ArsenalUserProfile.model";
import { ArsenalTagSerialized } from "~/models/ArsenalTag.model";

export default class ArsenalTagRepository {
    private readonly db: D1Database;

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get tag by it's label
     * @param label Label of tag to get
     * @returns a Arsenal Tag
     */
    async getByLabel(label: string): Promise<ArsenalTagSerialized | null> {
        return await this.db.prepare(`
            SELECT
                label,
                type
            FROM tag
            WHERE label = ?1
        `).bind(
            label
        ).first<ArsenalTagSerialized>();
    }

    /**
     * Get all tags for a loadout
     * @param loadoutId ID of loadout to fetch tags for
     * @returns Array of tags
     */
    async getByLoadout(loadoutId: string): Promise<ArsenalTagSerialized[]> {
        return (await this.db.prepare(`
            SELECT
                tag.label,
                tag.type
            FROM tag_loadout_relation tlr
            JOIN tag u ON tlr.tag_label = tag.label
            WHERE tlr.loadout_id = ?1
        `).bind(
            loadoutId
        ).all<ArsenalTagSerialized>()).results;
    }

    /**
     * Get the top most used tags
     * @param limit amount of tags to get, 10 by default
     * @returns an array of Arsenal Tags
     */
    async getTopTags(limit: number = 10): Promise<ArsenalTagSerialized[]> {
        const tags = (await this.db.prepare(`
            SELECT
             tag.label,
             tag.type,
             GROUP_CONCAT(tag_loadout_relation.loadout_id) AS loadouts,
             COUNT(tag_loadout_relation.loadout_id) AS loadout_count
            FROM tag_loadout_relation
            INNER JOIN tag ON tag.label = tag_loadout_relation.tag_label
            GROUP BY tag.label, tag.type
            ORDER BY loadout_count DESC
            LIMIT ?1
        `).bind(
            limit
        ).all<ArsenalTagSerialized & { loadouts: string, loadout_count: number }>()).results;
    
        return tags.map<ArsenalTagSerialized>(row => ({
            ...row,
            loadouts: row.loadouts.split(',')
        }));
    }

    /**
     * Get all loadouts associated by tag
     * @param label Label of tag to get loadouts for
     * @param limit amount of loadouts to get
     * @param offset offset of search
     * @returns Array of loadouts
     */
    async getLoadoutsByLabel(label: string, limit = 10, offset = 0): Promise<ArsenalLoadoutSerialized[]> {
        const loadouts = (await this.db.prepare(`
            SELECT
                loadout.id,
                loadout.title,
                loadout.description,
                loadout.preview AS jsonPreview,
                loadout.visibility,
                loadout.created_at AS created,
                loadout.updated_at AS updated,
                GROUP_CONCAT(tag.label) AS tag_labels,
                GROUP_CONCAT(tag.type) AS tag_types,
                user.id AS owner_id,
                user.username AS owner_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName
            FROM tag_loadout_relation tlr
            JOIN loadout on tlr.loadout_id = loadout.id
            JOIN tag on tlr.tag_label = tag.label
            JOIN user on loadout.owner = user.id
            JOIN user_profile on loadout.owner = user_profile.id
            WHERE tlr.label = ?1 AND loadout.visibility = 1
            ORDER BY loadout.created_at DESC
            LIMIT ?2 OFFSET ?3
        `).bind(
            label,
            limit,
            offset
        ).all<ArsenalLoadoutRaw>()).results;

        return loadouts.map((loadout) => {
            return {
                id: loadout.id,
                title: loadout.title,
                description: loadout.description,
                preview: new LoadoutPreview(JSON.parse(loadout.jsonPreview)).serialize(),
                owner: new ArsenalUser({
                    id: loadout.user_id,
                    username: loadout.user_username,
                    profile: new ArsenalUserProfile({
                        userId: loadout.user_id,
                        username: loadout.user_username,
                        displayName: loadout.user_displayName,
                        avatar: loadout.user_avatar
                    })
                }).serialize(),
                visibility: loadout.visibility,
                tags: loadout.tag_labels.map((label, index) => {
                    return {
                        label: label,
                        type: loadout.tag_types[index]
                    };
                }),
                created: loadout.created,
                updated: loadout.updated
            }
        });
    }

    /**
     * Add a tag to a loadout
     * @param loadoutId ID of loadout to add contributor to
     * @param tag Tag to add
     */
    async addToLoadout(loadoutId: string, tag: ArsenalTagSerialized): Promise<void> {
        await this.db.prepare(`
            INSERT OR IGNORE INTO tag (label, type)
            VALUES(?1, ?2)
        `).bind(
            tag.label,
            tag.type
        ).run();

        await this.db.prepare(`
            INSERT OR IGNORE INTO tag_loadout_relation (tag_label, loadout_id)
            VALUES(?1, ?2)
        `).bind(
            tag.label,
            loadoutId
        ).run();
    }

    /**
     * Creates table if it doesn't exist
     * @private
     */
    private _createTable() {
        try {
            this.db.prepare(`
            CREATE TABLE IF NOT EXISTS tag (
                label TEXT NOT NULL PRIMARY KEY UNIQUE,
                type INT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tag_loadout_relation (
                tag_label TEXT NOT NULL,
                loadout_id TEXT NOT NULL,
                FOREIGN KEY (tag_label) REFERENCES tag(label) ON DELETE CASCADE,
                FOREIGN KEY (loadout_id) REFERENCES loadouts(id) ON DELETE CASCADE,
                PRIMARY KEY (tag_label, loadout_id)
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