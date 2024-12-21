/** 
 * @file [loadout_id].get.ts
 * @description API to Get a single loadout by it's ID
 * 
 * @route /api/v2/loadouts/:loadout_id
 * @method GET
 */

import { ArsenalLoadoutSerialized, ArsenalLoadoutVisibility } from "~/models/ArsenalLoadout.model";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for getting a loadout by it's ID.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalLoadoutSerialized | null>} The response object.
 */
export default defineEventHandler(async (event): Promise<ArsenalLoadoutSerialized | null> => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);

  if (!event.context.params?.id) throw createError({
    message: 'Missing Loadout ID',
    statusCode: 400
  });
  
  const loadoutId = event.context.params.id;

  try {
    const loadout =  await loadoutRepository.getById(loadoutId);

    if (loadout?.visibility === ArsenalLoadoutVisibility.private) {
      const { user } = await validateSession(event.context.session, lucia);

      if (!await loadoutRepository.isViewAuthorized(loadout.id, user.id)) {
        throw createError({
          message: 'User attempted unauthorized access.',
          statusCode: 403
        });
      }
    }

    return loadout;
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: e,
      statusCode: 500
    })
  }

});
