import { D1Database } from "@nuxthub/core";
import { mixed, number, object, string, ValidationError } from "yup";
import { LoadoutItemSerialized } from "~/models/LoadoutItem.model";
import LoadoutCategoryRepository from "./category";

export default class LoadoutItemRepository {
    private readonly db: D1Database;
    public readonly schema = object({
        id: string().required('Missing ID'),
        parent: mixed().test('Invalid parent Type', async (value): Promise<boolean> => {
            return (await new LoadoutCategoryRepository(this.db).schema.isValid(value))
        }).required('Missing parent'),
        loadout_id: string().required('Missing Loadout ID'),
        position: number().required('Missing Position'),
        title: string().required('Missing Title'),
        description: string(),
        preview: object({
            type: number().required('Missing Preview Type'),
            path: string().required('Missing Preview Path')
        })
    })

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get all items from a category
     * @param loadoutId ID of loadout
     * @param itemId ID of category to fetch items for
     * @returns Array of items
     */
    async categoryGetAll(loadoutId: string, categoryId: string): Promise<LoadoutItemSerialized[]> {
        console.log('we are here');
        return (await this.db.prepare(`
            SELECT
                id,
                position,
                title,
                description,
                preview,
                category_id,
                loadout_id
            FROM loadout_item
            WHERE category_id = ?1 AND loadout_id = ?2
            ORDER BY position ASC
        `).bind(
            categoryId,
            loadoutId
        ).all<LoadoutItemSerialized>()).results;
    }

    /**
     * Get a item by it's ID
     * @param loadoutId ID of loadout
     * @param itemId ID of item to get
     * @returns item
     */
    async getById(loadoutId: string, itemId: string): Promise<LoadoutItemSerialized | null> {
        console.log(itemId)
        return await this.db.prepare(`
            SELECT
                id,
                position,
                title,
                description,
                preview,
                category_id,
                loadout_id
            FROM loadout_item
            WHERE id = ?1 AND loadout_id = ?2
        `).bind(
            itemId,
            loadoutId
        ).first<LoadoutItemSerialized>();
    }

    /**
     * Create a new item from data
     * @param loadoutId ID of parent loadout
     * @param item A serialized Loadout Item Class.
     */
    async create(loadoutId: string, item: LoadoutItemSerialized): Promise<void> {
        await this.db.prepare(`
            INSERT INTO loadout_item (id, category_id, loadout_id, position, title, description, preview)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
        `).bind(
            item.id,
            item.parent.id ?? null,
            loadoutId,
            item.position,
            item.title,
            item.description ?? '',
            JSON.stringify(item.preview) ?? null
        ).run();
    }

    /**
     * Updates a item
     * @param loadoutId ID of loadout the category is attached to
     * @param itemId ID of item to update
     * @param item Serialized Loadout Item Class with updated values
     */
    public async update(loadoutId: string, itemId: string, item: LoadoutItemSerialized): Promise<any> {
        return await this.db.prepare(`
            UPDATE loadout_item
            SET title = ?3, description = ?4, preview = ?5, position = ?6
            WHERE id = ?1 AND loadout_id = ?2
        `).bind(
            itemId,
            loadoutId,
            item.title,
            item.description ?? '',
            JSON.stringify(item.preview) ?? null,
            item.position
        ).run();
    }

    /**
     * Delete a item by id
     * @param loadoutId ID of loadout the category is attached to
     * @param itemId ID of item to delete
     */
    public async delete(loadoutId: string, itemId: string): Promise<any> {
        return await this.db.prepare(`
            DELETE FROM loadout_item WHERE id = ?1 AND loadout_id = ?2
        `).bind(
            itemId,
            loadoutId
        ).run();
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
            this.db.prepare(`CREATE TABLE IF NOT EXISTS loadout_item (
                id TEXT PRIMARY KEY NOT NULL,
                category_id TEXT NOT NULL,
                loadout_id TEXT NOT NULL,
                position INTEGER,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                preview TEXT,
                FOREIGN KEY(category_id) REFERENCES loadout_category(id) ON DELETE CASCADE
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