/** 
 * @file index.post.ts
 * @description API to create a new loadout
 * 
 * @route /api/v2/loadouts
 * @method POST
 */

import { ArsenalLoadoutSerialized } from "~/models/ArsenalLoadout.model";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

/**
 * API handler for creating loadouts.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const body = await readBody<ArsenalLoadoutSerialized>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  /* Check if body is valid */
  loadoutRepository.schema.isValid(body).catch((e: any) => {
    console.warn(e);
    throw createError({
      message: e,
      statusCode: 400
    });
  });

  /* Check if user is trying to create loadout for different user */
  if (body.owner !== user.id) throw createError({
    message: 'Attempted to create loadout Unauthorized',
    statusCode: 403
  });

  try {
    return await loadoutRepository.create(body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
