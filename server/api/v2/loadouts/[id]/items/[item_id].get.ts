/** 
 * @file [item_id].get.ts
 * @description API to get an item by it's ID
 * 
 * @route /api/v2/loadouts/:id/items/:item_id
 * @method GET
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
export default defineEventHandler(async (event): Promise<null | LoadoutItemSerialized> => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const itemRepository = new LoadoutItemRepository(event.context.db);

  if (!event.context.params?.id) throw createError({
    message: 'Missing loadout ID',
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
    const itemId = event.context.params.item_id;
    return await itemRepository.getById(loadoutId, itemId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
