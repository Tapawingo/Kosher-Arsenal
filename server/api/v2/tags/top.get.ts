/** 
 * @file index.get.ts
 * @description API to Get top tags
 * 
 * @route /api/v2/tags/top
 * @method GET
 */

import { ArsenalTagSerialized } from "~/models/ArsenalTag.model";
import ArsenalTagRepository from "~/server/repositories/tag";

interface IQuery {
  limit: string;
}

/**
 * API handler for getting top tags
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalTagSerialized[]>} The response object.
 */
export default defineEventHandler(async (event): Promise<ArsenalTagSerialized[]> => {
  const tagRepository = new ArsenalTagRepository(event.context.db);
  const query = getQuery<IQuery>(event);
  
  try {
    return await tagRepository.getTopTags(parseInt(query.limit, 10));
  } catch (e: any) {
    console.error(e);
    throw createError({
      statusCode: 500,
      message: 'Something went wrong'
    });
  }
});
