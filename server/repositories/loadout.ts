import { D1Database } from "@nuxthub/core";
import { ArsenalLoadoutSerialized, ArsenalLoadoutVisibility } from "~/models/ArsenalLoadout.model";
import { array, number, object, string, ValidationError } from "yup";
import LoadoutContributorRepository from "./contributor";
import LoadoutCategoryRepository from "./category";
import { dateToSQL } from "../utils/db";
import LoadoutItemRepository from "./item";
import { LoadoutPreview } from "~/models/LoadoutPreview.model";
import { ArsenalUser } from "~/models/ArsenalUser.model";
import { ArsenalUserProfile } from "~/models/ArsenalUserProfile.model";

export interface ArsenalLoadoutRaw extends ArsenalLoadoutSerialized {
     user_id: string, 
     user_username: string, 
     user_displayName: string, 
     user_avatar: string, 
     jsonPreview: string,
     tag_labels: string[],
     tag_types: number[]
}

export default class LoadoutRepository {
    private readonly db: D1Database;
    public readonly schema = object({
        id: string().required('Missing ID'),
        title: string().required('Missing Title'),
        description: string(),
        preview: object({
            type: number().required('Missing Preview Type'),
            path: string().required('Missing Preview Path')
        }).required('Missing Preview'),
        owner: string().required('Missing Owner ID'),
        visibility: number().required('Missing visibility'),
        created_at: string().datetime(),
        updated_at: string().datetime(),
        categories: array(),
        contributors: array()
    });

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get all existing loadouts
     * @param limit Max amount of loadouts to fetch
     * @param offset Offset of loadouts to fetch
     * @param visibilities Array of Loadout visibility values to filter for
     * @returns Array of loadouts
     */
    async getAll(limit = 10, offset = 0, visibilities: number[] = [0]): Promise<ArsenalLoadoutSerialized[]> {
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
            FROM loadout
            JOIN user ON loadout.owner = user.id
            JOIN user_profile ON loadout.owner = user_profile.id
            JOIN tag_loadout_relation tlr ON loadout.id = tlr.loadout_id
            JOIN tag on tlr.tag_label = tag.label
            WHERE loadout.visibility IN (${ visibilities.join(', ') })
            ORDER BY loadout.created_at DESC
            LIMIT ?1 OFFSET ?2
        `).bind(
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
                tags: loadout.tag_labels.map((label, index) => {
                    return {
                        label: label,
                        type: loadout.tag_types[index]
                    };
                }),
                visibility: loadout.visibility,
                created: loadout.created,
                updated: loadout.updated
            }
        });
    }

    /**
     * Get a loadout by it's ID
     * @param loadoutId ID of loadout to get
     * @returns Loadout
     */
    async getById(loadoutId: string): Promise<ArsenalLoadoutSerialized | null> {
        const loadout =  (await this.db.prepare(`
            SELECT
                loadout.id,
                loadout.title,
                loadout.description,
                loadout.preview AS jsonPreview,
                loadout.visibility,
                GROUP_CONCAT(tag.label) AS tag_labels,
                GROUP_CONCAT(tag.type) AS tag_types,
                loadout.created_at AS created,
                loadout.updated_at AS updated,
                user.id AS owner_id,
                user.username AS user_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName
            FROM loadout
            JOIN user ON loadout.owner = user.id
            JOIN user_profile ON loadout.owner = user_profile.id
            JOIN tag_loadout_relation tlr ON loadout.id = tlr.loadout_id
            JOIN tag on tlr.tag_label = tag.label
            WHERE loadout.id = ?1
        `).bind(
            loadoutId
        ).first<ArsenalLoadoutRaw>());

        if (!loadout) return null;

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
            tags: loadout.tag_labels.map((label, index) => {
                return {
                    label: label,
                    type: loadout.tag_types[index]
                };
            }),
            visibility: loadout.visibility,
            created: loadout.created,
            updated: loadout.updated
        }
    }

    /**
     * Get all loadouts owned by a user
     * @param userId ID of loadouts to get
     * @param limit Max amount of loadouts to fetch
     * @param offset Offset of loadouts to fetch
     * @param visibilities Array of visibilities to filter by
     * @returns Array of Loadouts
     */
    async getByUser(userId: string, limit = 10, offset = 0, visibilities: number[] = [0]): Promise<ArsenalLoadoutSerialized[]> {
        const loadouts = (await this.db.prepare(`
            SELECT
                loadout.id,
                loadout.title,
                loadout.description,
                loadout.preview AS jsonPreview,
                loadout.visibility,
                GROUP_CONCAT(tag.label) AS tag_labels,
                GROUP_CONCAT(tag.type) AS tag_types,
                loadout.created_at AS created,
                loadout.updated_at AS updated,
                user.id AS owner_id,
                user.username AS user_username,
                user_profile.avatar AS user_avatar,
                user_profile.display_name AS user_displayName
            FROM loadout
            JOIN user on loadout.owner = user.id
            JOIN user_profile on loadout.owner = user_profile.id
            JOIN tag_loadout_relation tlr ON loadout.id = tlr.loadout_id
            JOIN tag on tlr.tag_label = tag.label
            WHERE loadout.owner = ?1 AND loadout.visibility IN (${ visibilities.join(', ') })
            LIMIT ?2 OFFSET ?3
        `).bind(
            userId,
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
                tags: loadout.tag_labels.map((label, index) => {
                    return {
                        label: label,
                        type: loadout.tag_types[index]
                    };
                }),
                visibility: loadout.visibility,
                created: loadout.created,
                updated: loadout.updated
            }
        })
    }

    /**
     * Create a new loadout from data
     * @param loadout A serialized Arsenal Loadout Class.
     */
    async create(loadout: ArsenalLoadoutSerialized): Promise<any> {
        try {
            await this.db.prepare(`
                INSERT INTO loadout (id, title, description, preview, owner, visibility)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6)
            `).bind(
                loadout.id,
                loadout.title,
                loadout.description ?? '',
                JSON.stringify(loadout.preview) ?? '',
                loadout.owner,
                loadout.visibility
            ).run();

            /* Create categories if they are defined */
            if (loadout.categories) {
                new LoadoutCategoryRepository(this.db).createMultiple(loadout.id, loadout.categories);
            }
    
            /* Link contributor if they are defined */
            if (loadout.contributors) {
                new LoadoutContributorRepository(this.db).addMultiple(loadout.id, loadout.contributors);
            }
        } catch(e: any) {
            console.error(e);
            throw createError({
                message: 'Something went wrong',
                statusCode: 500
            });
        }

    }

    /**
     * Updates a loadout
     * @param id ID of loadout to update
     * @param loadout Serialized Arsenal Loadout Class with updated values
     */
    public async update(id: string, loadout: Partial<ArsenalLoadoutSerialized>): Promise<any> {
        return await this.db.prepare(`
            UPDATE loadout
            SET title = ?2, description = ?3, preview = ?4, visibility = ?5, updated_at = ?6
            WHERE id = ?1
        `).bind(
            id,
            loadout.title,
            loadout.description ?? '',
            JSON.stringify(loadout.preview) ?? '',
            loadout.visibility,
            dateToSQL(new Date())
        ).run();
    }

    /**
     * Deletes a loadout
     * @param id ID of loadout to delete
     */
    public async delete(id: string): Promise<void> {
        await this.db.prepare(`DELETE FROM loadout where id = ?1`).bind(id).run();
    }

    /**
     * Checks if a user is authorized to view the loadout
     * @param {string} loadoutId ID of loadout to check
     * @param {string} userId ID of user to check
     * @returns {boolean} True if user is allowed
     */
    public async isViewAuthorized(loadoutId: string, userId?: string): Promise<boolean> {
        const loadout = await this.db.prepare(`
            SELECT
                owner,
                visibility
            FROM loadout
            WHERE id = ?1
        `).bind(
            loadoutId
        ).first<{ owner: string, visibility: number }>();

        if (loadout?.visibility === ArsenalLoadoutVisibility.private && loadout.owner !== userId) {
            const contributor = await this.db.prepare(`
                SELECT
                    user_id
                FROM loadout_contributor
                WHERE user_id = ?1 AND loadout_id = ?2
            `).bind(
                userId,
                loadoutId
            ).first<{ user_id: string }>();

            if (!contributor) return false;
            return true;
        };

        return true;
    }

    /**
     * Checks if a user is authorized to make changes to the loadout
     * @param {string} loadoutId ID of loadout to check
     * @param {string} userId ID of user to check
     * @returns {boolean} True if user is allowed
     */
    public async isEditAuthorized(loadoutId: string, userId?: string): Promise<boolean> {
        const loadout = await this.db.prepare(`
            SELECT
                owner
            FROM loadout
            WHERE id = ?1
        `).bind(
            loadoutId
        ).first<{ owner: string, visibility: number }>();

        if (loadout?.owner !== userId) {
            const contributor = await this.db.prepare(`
                SELECT
                    user_id
                FROM loadout_contributor
                WHERE user_id = ?1 AND loadout_id = ?2
            `).bind(
                userId,
                loadoutId
            ).first<{ user_id: string }>();

            if (!contributor) return false;
            return true;
        };

        return true;
    }

    /**
     * Checks if a user is authorized to delete the loadout
     * @param {string} loadoutId ID of loadout to check
     * @param {string} userId ID of user to check
     * @returns {boolean} True if user is allowed
     */
    public async isDeleteAuthorized(loadoutId: string, userId?: string): Promise<boolean> {
        const loadout = await this.db.prepare(`
            SELECT
                owner
            FROM loadout
            WHERE id = ?1
        `).bind(
            loadoutId
        ).first<{ owner: string, visibility: number }>();

        if (loadout?.owner !== userId) return false;
        return true;
    }

    /**
     * Validate request body
     * @param body Body to validate
     */
    public async validateBody(body: any) {
        try {
            await this.schema.validate(body);

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
                    message: e,
                    statusCode: 400
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
            // @FIXME: delete and recreate loadout table for new changes
            this.db.prepare(`CREATE TABLE IF NOT EXISTS loadout (
                id TEXT PRIMARY KEY NOT NULL,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(1024) NOT NULL,
                preview TEXT NOT NULL,
                owner TEXT NOT NULL,
                visibility BIGINT NOT NULL,
                created_at NOT NULL TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at NOT NULL TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE
            )`).run();

            // Create all the other tables to avoid foreign key constraint fails
            new LoadoutContributorRepository(this.db);
            new LoadoutCategoryRepository(this.db);
            new LoadoutItemRepository(this.db);
        } catch (e: any) {
            console.error(e);
            throw createError({
                message: 'Something went wrong',
                statusCode: 500
            });
        }
    }
}