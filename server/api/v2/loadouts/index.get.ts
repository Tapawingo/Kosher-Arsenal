/** 
 * @file index.get.ts
 * @description API to Get all loadouts filtered by owner or visibility (or both)
 * 
 * @route /api/v2/loadouts/:id/categories
 * @method POST
 * 
 * @param limit amount of loadouts to get
 * @param offset index offset of loadouts to get (for pagination)
 */

import { ArsenalLoadoutSerialized } from "~/models/ArsenalLoadout.model";
import LoadoutRepository from "~/server/repositories/loadout";

interface IQuery {
  limit: string;
  offset: string;
}

/**
 * API handler for getting loadouts.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalLoadoutSerialized[]>} The response object.
 */
export default defineEventHandler(async (event): Promise<ArsenalLoadoutSerialized[]> => {
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const query = getQuery<IQuery>(event)
  
  try {
    const limit = !isNaN(parseInt(query.limit)) ? parseInt(query.limit) : 10;
    const offset = !isNaN(parseInt(query.offset)) ? parseInt(query.limit) : 0;
    return await loadoutRepository.getAll(limit, offset);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
