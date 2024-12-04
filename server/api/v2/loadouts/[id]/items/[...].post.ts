/** 
 * @file [...].post.ts
 * @description API to add a item to a category
 * 
 * @route /api/v2/loadouts/:id/items
 * @method POST
 * 
 * @param category_id ID of category to add item to
 */

import { LoadoutItemSerialized } from "~/models/LoadoutItem.model";
import LoadoutItemRepository from "~/server/repositories/item";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for creating items.
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

  /* Check if user is permitted to make changes to loadout */
  const loadoutId = event.context.params.id;
  if (!await loadoutRepository.isEditAuthorized(loadoutId, user?.id)) throw createError({
    message: 'User attempted unauthorized update',
    statusCode: 403
  });

  /* Check if body is valid */
  itemRepository.schema.isValid(body).catch((e: any) => {
    console.warn(e);
    throw createError({
      message: e,
      statusCode: 400
    });
  });

  /* Create category */
  try {
    return await itemRepository.create(loadoutId, body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
