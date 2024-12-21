/** 
 * @file index.get.ts
 * @description API to Get tags associated with a loadout
 * 
 * @route /api/v2/loadouts/:id/tags
 * @method GET
 */

import { ArsenalTagSerialized } from "~/models/ArsenalTag.model";
import ArsenalTagRepository from "~/server/repositories/tag";

/**
 * API handler for getting tags for a loadout
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalTagSerialized[]>} The response object.
 */
export default defineEventHandler(async (event): Promise<ArsenalTagSerialized[]> => {
  const tagRepository = new ArsenalTagRepository(event.context.db);

  if (!event.context.params?.id) throw createError({
    message: 'Missing Loadout ID',
    statusCode: 400
  });
  
  try {
    const loadoutId = event.context.params.id;
    return await tagRepository.getByLoadout(loadoutId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      statusCode: 500,
      message: 'Something went wrong'
    });
  }
});
