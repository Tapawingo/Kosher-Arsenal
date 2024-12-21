/** 
 * @file index.get.ts
 * @description API to add a tag to a loadout
 * 
 * @route /api/v2/loadouts/:id/tags
 * @method POST
 */

import { ArsenalTagSerialized } from "~/models/ArsenalTag.model";
import ArsenalTagRepository from "~/server/repositories/tag";

/**
 * API handler for adding a tag to a loadout
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event) => {
  const tagRepository = new ArsenalTagRepository(event.context.db);
  const body = await readBody<ArsenalTagSerialized>(event);

  if (!event.context.params?.id) throw createError({
    message: 'Missing Loadout ID',
    statusCode: 400
  });
  
  try {
    const loadoutId = event.context.params.id;
    await tagRepository.addToLoadout(loadoutId, body);
  } catch (e: any) {
    console.error(e);
    throw createError({
      statusCode: 500,
      message: 'Something went wrong'
    });
  }
});
