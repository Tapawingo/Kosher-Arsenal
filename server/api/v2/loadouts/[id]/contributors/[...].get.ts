/** 
 * @file index.get.ts
 * @description API to get a contributor
 * 
 * @route /api/v2/loadouts/:id/contributors
 * @method GET
 */

import { ArsenalUserSerialized } from "~/models/ArsenalUser.model";
import LoadoutContributorRepository from "~/server/repositories/contributor";
import LoadoutRepository from "~/server/repositories/loadout";

/**
 * API handler for getting contributors.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalUserSerialized[]>} The response object.
 */
export default defineEventHandler(async (event): Promise<ArsenalUserSerialized[]> => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const contributorRepository = new LoadoutContributorRepository(event.context.db);

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
    const loadoutId = event.context.params.id;
    return await contributorRepository.loadoutGetAll(loadoutId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
