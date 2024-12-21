import { D1Database } from "@nuxthub/core";
import { mixed, number, object, string, ValidationError } from "yup";
import { LoadoutCategorySerialized, LoadoutCategoryType } from "~/models/LoadoutCategory.model";
import LoadoutRepository from "./loadout";
import LoadoutItemRepository from "./item";

export default class LoadoutCategoryRepository {
    private readonly db: D1Database;
    public readonly schema = object({
        id: string().required('Missing ID'),
        parent: mixed().test('Invalid parent Type', async (value) => {
            return (await new LoadoutRepository(this.db).schema.isValid(value)) ||
                (await new LoadoutItemRepository(this.db).schema.isValid(value))
        }).required('Missing parent'),
        loadout_id: string().required('Missing Loadout ID'),
        type: number().required('Missing Type'),
        position: number().required('Missing Position'),
        icon: string().required('Missing Icon'),
        title: string().required('Missing Title')
    })

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get all categories for a loadout
     * @param loadoutId ID of loadout to fetch categories for
     * @returns Array of categories
     */
    async loadoutGetAll(loadoutId: string): Promise<LoadoutCategorySerialized[]> {
        return (await this.db.prepare(`
            SELECT
                id,
                position,
                loadout_id,
                icon,
                title
            FROM loadout_category
            WHERE loadout_id = ?1
        `).bind(
            loadoutId
        ).all<LoadoutCategorySerialized>()).results;
    }

    /**
     * Get all categories for a item
     * @param itemId ID of item to fetch categories for
     * @returns Array of categories
     */
    async itemGetAll(itemId: string): Promise<LoadoutCategorySerialized[]> {
        return (await this.db.prepare(`
            SELECT
                id,
                position,
                item_id,
                icon,
                title
            FROM loadout_category
            WHERE item_id = ?1
        `).bind(
            itemId
        ).all<LoadoutCategorySerialized>()).results;
    }

    /**
     * Get a category by it's ID
     * @param loadoutId ID of loadout
     * @param categoryId ID of category to get
     * @returns category
     */
    async getById(loadoutId: string, categoryId: string): Promise<LoadoutCategorySerialized | null> {
        return await this.db.prepare(`
            SELECT 
                id, 
                position, 
                loadout_id, 
                icon, 
                title
            FROM loadout_category 
            WHERE id = ?1 AND loadout_id = ?2
        `).bind(
            categoryId,
            loadoutId
        ).first<LoadoutCategorySerialized>();
    }

    /**
     * Create a new category from data
     * @param loadoutId ID of loadout the category is attached to
     * @param category A serialized Loadout Category Class.
     */
    async create(loadoutId: string, category: LoadoutCategorySerialized): Promise<void> {
        await this.db.prepare(`
            INSERT INTO loadout_category (id, loadout_id, item_id, position, icon, title)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        `).bind(
            category.id,
            loadoutId,
            category.type === LoadoutCategoryType.sub ? category.parent.id : null,
            category.position,
            category.icon,
            category.title
        ).run();
    }

    /**
     * Create multiple new categories
     * @param loadoutId ID of loadout the category is attached to
     * @param loadout An Array of serialized Loadout Category Classes.
     */
    async createMultiple(loadoutId: string, categories: LoadoutCategorySerialized[]): Promise<any> {
        const values = categories.map((category) => {
            return `(${ [
                category.id,
                loadoutId,
                category.type === LoadoutCategoryType.sub ? category.parent.id : null,
                category.position,
                category.icon,
                category.title
            ].join(', ') })`
        });

        try {
            await this.db.prepare(`
                INSERT INTO loadout_category (id, loadout_id, item_id, position, icon, title)
                VALUES ${ values.join(', ') }
            `).run();
        } catch (e: any) {
            console.error(e);
            throw createError({
                message: 'Something went wrong',
                statusCode: 500
            })
        }
    }

    /**
     * Update Category with new values
     * @param loadoutId ID of loadout the category is attached to
     * @param categoryId ID of category to update
     * @param category Serialized Loadout Category Class with updated values
     */
    public async update(loadoutId: string, categoryId: string, category: LoadoutCategorySerialized): Promise<any> {
        return await this.db.prepare(`
            UPDATE loadout_category
            SET title = ?3, icon = ?4, position = ?5
            WHERE id = ?1 AND loadout_id = ?2
        `).bind(
            categoryId,
            loadoutId,
            category.title,
            category.icon,
            category.position
        ).run();
    }

    /**
     * Delete a category by id
     * @param loadoutId ID of loadout the category is attached to
     * @param categoryId ID of category to delete
     */
    public async delete(loadoutId: string, categoryId: string): Promise<any> {
        return await this.db.prepare(`
            DELETE FROM loadout_category WHERE id = ?1 AND loadout_id = ?2;
        `).bind(
            categoryId,
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
            this.db.prepare(`CREATE TABLE IF NOT EXISTS loadout_category (
                id TEXT PRIMARY KEY NOT NULL,
                loadout_id TEXT NOT NULL,
                item_id TEXT,
                position INTEGER DEFAULT 0 NOT NULL,
                icon TEXT NOT NULL,
                title TEXT NOT NULL,
                FOREIGN KEY(loadout_id) REFERENCES loadout(id) ON DELETE CASCADE,
                FOREIGN KEY(item_id) REFERENCES loadout_item(id) ON DELETE CASCADE
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