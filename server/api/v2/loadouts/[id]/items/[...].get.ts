/** 
 * @file [...].get.ts
 * @description API to get all items of a category
 * 
 * @route /api/v2/loadouts/:id/items
 * @method GET
 * 
 * @param category_id ID of category to add item to
 */

import { LoadoutItemSerialized } from "~/models/LoadoutItem.model";
import LoadoutItemRepository from "~/server/repositories/item";
import LoadoutRepository from "~/server/repositories/loadout";

interface IQuery {
  category_id?: string;
}

/**
 * API handler for getting items.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<LoadoutItemSerialized[]>} The response object.
 */
export default defineEventHandler(async (event): Promise<LoadoutItemSerialized[]> => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const itemRepository = new LoadoutItemRepository(event.context.db);
  const query = getQuery<IQuery>(event)

  if (!event.context.params?.id) throw createError({
    message: 'Missing loadout ID',
    statusCode: 400
  });

  if (!query.category_id) throw createError({
    message: 'Missing category ID',
    statusCode: 400
  });

  /* Check if user has access to parent loadout */
  const { user } = await lucia.validateSession(event.context.session?.id ?? '');
  const loadoutId = event.context.params.id;
  if (!await loadoutRepository.isViewAuthorized(loadoutId, user?.id)) throw createError({
    message: 'User attempted unauthorized access',
    statusCode: 403
  });

  try {
    const categoryId = query.category_id;
    return await itemRepository.categoryGetAll(loadoutId, categoryId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
