/** 
 * @file [...].patch.ts
 * @description API to update a loadout
 * 
 * @route /api/v2/loadouts/:loadout_id
 * @method PATCH
 */

import { ArsenalLoadoutSerialized } from "~/models/ArsenalLoadout.model";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for updating loadouts.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const body = await readBody<ArsenalLoadoutSerialized>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check if loadout ID has been provided */
  if (!event.context.params?.id) throw createError({
    message: 'Missing Loadout ID',
    statusCode: 400
  });
  
  const loadoutId = event.context.params.id;

  /* Check if body is valid */
  if (!await loadoutRepository.validateBody(body)) {
    throw createError({
      message: 'Invalid body',
      statusCode: 400
    });
  }

  /* Check if user is authorized to update loadout */
  if (!await loadoutRepository.isEditAuthorized(loadoutId, user.id)) throw createError({
    message: 'User attempted unauthorized update',
    statusCode: 403
  });

  /* Create loadout */
  try {
    return await loadoutRepository.update(loadoutId, body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});