/** 
 * @file [category_id].patch.ts
 * @description API to update a category
 * 
 * @route /api/v2/loadouts/:id/categories/:category_id
 * @method PATCH
 */

import { LoadoutCategorySerialized } from "~/models/LoadoutCategory.model";
import LoadoutCategoryRepository from "~/server/repositories/category";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for updating categories.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const categoryRepository = new LoadoutCategoryRepository(event.context.db);
  const body = await readBody<LoadoutCategorySerialized>(event);

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
  if (!await loadoutRepository.isEditAuthorized(loadoutId, user.id)) throw createError({
    message: 'User attempted unauthorized access',
    statusCode: 403
  });

  /* Check if body is valid */
  if (!await categoryRepository.validateBody(body)) {
    throw createError({
      message: 'Invalid body',
      statusCode: 400
    });
  }

  /* Update category */
  try {
    const categoryId = event.context.params.category_id;
    return await categoryRepository.update(loadoutId, categoryId, body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
})
