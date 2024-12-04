/** 
 * @file [category_id].delete.ts
 * @description API to delete a category
 * 
 * @route /api/v2/loadouts/:id/categories/:category_id
 * @method DELETE
 */

import LoadoutCategoryRepository from "~/server/repositories/category";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for deleting categories.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<any>} The response object.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const categoryRepository = new LoadoutCategoryRepository(event.context.db);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check for loadout ID */
  if (!event.context.params?.id) throw createError({
    message: 'Missing loadout ID',
    statusCode: 400
  });

  /* Check for category ID */
  if (!event.context.params?.category_id) throw createError({
    message: 'Missing category ID',
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
    const categoryId = event.context.params.category_id;
    return await categoryRepository.delete(loadoutId, categoryId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
