/** 
 * API to update a item
 * @file [item_id].patch.ts
 * 
 * @route /api/v2/loadouts/:id/items/:item_id
 * @method PATCH
 */

import { LoadoutItemSerialized } from "~/models/LoadoutItem.model";
import LoadoutItemRepository from "~/server/repositories/item";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for updating items.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const itemRepository = new LoadoutItemRepository(event.context.db);
  const body = await readBody<LoadoutItemSerialized>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check for loadout ID */
  if (!event.context.params?.id) throw createError({
    message: 'Missing loadout ID',
    statusCode: 400
  });

  /* Check for category ID */
  if (!event.context.params?.item_id) throw createError({
    message: 'Missing item ID',
    statusCode: 400
  });

  /* Check if user is permitted to make changes to loadout */
  const loadoutId = event.context.params.id;
  if (!await loadoutRepository.isEditAuthorized(loadoutId, user.id)) throw createError({
    message: 'User attempted unauthorized access',
    statusCode: 403
  });

  /* Check if body is valid */
  itemRepository.schema.isValid(body).catch((e: any) => {
    throw createError({
      message: e,
      statusCode: 400
    });
  });

  /* Update category */
  try {
    const itemId = event.context.params.item_id;
    return await itemRepository.update(loadoutId, itemId, body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});