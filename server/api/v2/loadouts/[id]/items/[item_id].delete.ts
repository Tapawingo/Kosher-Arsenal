/** 
 * @file [item_id].delete.ts
 * @description API to delete a item
 * 
 * @route /api/v2/loadouts/:id/items/:item_id
 * @method DELETE
 */

import LoadoutItemRepository from "~/server/repositories/item";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for deleting items.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const itemRepository = new LoadoutItemRepository(event.context.db);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check for loadout ID */
  if (!event.context.params?.id) throw createError({
    message: 'Missing loadout ID',
    statusCode: 400
  });

  /* Check if user is permitted to make changes to loadout */
  const loadoutId = event.context.params.id;
  if (!await loadoutRepository.isDeleteAuthorized(loadoutId, user?.id)) throw createError({
    message: 'User attempted unauthorized delete',
    statusCode: 403
  });

  /* Delete category */
  try {
    const itemId = event.context.params.item_id;
    return await itemRepository.delete(loadoutId, itemId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});