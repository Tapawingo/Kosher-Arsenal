/**
 * Delete a loadout.
 * @file [loadout_id].delete.ts
 * @param loadout_id ID of loadout to delete
 * 
 * @route /api/v2/loadouts/:loadout_id
 * @method DELETE
 */

import { ArsenalLoadoutSerialized } from "~/models/ArsenalLoadout.model";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for deleting loadouts.
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
  if (!event.context.params?.loadout_id) throw createError({
    message: 'Missing Loadout ID',
    statusCode: 400
  });
  
  const loadoutId = event.context.params.loadout_id;

  /* Check if body is valid */
  loadoutRepository.schema.isValid(body).catch((e: any) => {
    throw createError({
      message: e,
      statusCode: 400
    });
  });

  /* Check if user is authorized to delete loadout */
  if (!await loadoutRepository.isDeleteAuthorized(loadoutId, user.id)) throw createError({
    message: 'User attempted unauthorized delete',
    statusCode: 403
  });

  /* Create loadout */
  try {
    return await loadoutRepository.delete(loadoutId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
