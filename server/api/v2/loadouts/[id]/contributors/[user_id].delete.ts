/** 
 * @file [user_id].delete.ts
 * @description API to remove a contributor
 */

import LoadoutContributorRepository from "~/server/repositories/contributor";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for removing contributors.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const categoryRepository = new LoadoutContributorRepository(event.context.db);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check for loadout ID */
  if (!event.context.params?.id) {
    throw createError({
      message: 'Missing loadout ID',
      statusCode: 400
    });
  }

  /* Check for user ID */
  if (!event.context.params?.user_id) {
    throw createError({
      message: 'Missing user ID',
      statusCode: 400
    });
  }

  /* Check if user is permitted to make changes to loadout */
  const loadoutId = event.context.params.id;
  if (!await loadoutRepository.isDeleteAuthorized(loadoutId, user?.id)) throw createError({
    message: 'User attempted unauthorized access',
    statusCode: 403
  });

  /* Create category */
  try {
    const userId = event.context.params.user_id;
    return await categoryRepository.remove(loadoutId, userId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
