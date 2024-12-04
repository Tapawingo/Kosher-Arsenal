/** 
 * @file [...].get.ts
 * @description API to get all categories
 * 
 * @route /api/v2/loadouts/:id/categories
 * @method GET
 */

import { LoadoutCategorySerialized } from "~/models/LoadoutCategory.model";
import LoadoutCategoryRepository from "~/server/repositories/category";
import LoadoutRepository from "~/server/repositories/loadout";

/**
 * API handler for getting categories.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<LoadoutCategorySerialized[]>} The response object.
 */
export default defineEventHandler(async (event): Promise<null | LoadoutCategorySerialized | LoadoutCategorySerialized[]> => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const categoryRepository = new LoadoutCategoryRepository(event.context.db);

  if (!event.context.params?.id) {
    throw createError({
      message: 'Missing loadout ID',
      statusCode: 400
    });
  }

  if (!event.context.params?.category_id) {
    throw createError({
      message: 'Missing category ID',
      statusCode: 400
    });
  }

  /* Check if user has access to parent loadout */
  const { user } = await lucia.validateSession(event.context.session?.id ?? ''); 
  const loadoutId = event.context.params.id;
  if (!await loadoutRepository.isViewAuthorized(loadoutId, user?.id)) throw createError({
    message: 'User attempted unauthorized access',
    statusCode: 403
  });

  try {
    const categoryId = event.context.params.category_id;
    return await categoryRepository.getById(loadoutId, categoryId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
