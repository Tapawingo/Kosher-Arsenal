/** 
 * @file index.get.ts
 * @description API to Get a tag by it's Label
 * 
 * @route /api/v2/tags/:label
 * @method GET
 */

import { ArsenalTagSerialized } from "~/models/ArsenalTag.model";
import ArsenalTagRepository from "~/server/repositories/tag";

/**
 * API handler for getting a tag by it's label
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 * @returns {Promise<ArsenalTagSerialized | null>} The response object.
 */
export default defineEventHandler(async (event): Promise<ArsenalTagSerialized | null> => {
  const tagRepository = new ArsenalTagRepository(event.context.db);

  if (!event.context.params?.label) throw createError({
    message: 'Missing Tag Label',
    statusCode: 400
  });
  
  try {
    const label = event.context.params.label;
    return await tagRepository.getByLabel(label);
  } catch (e: any) {
    console.error(e);
    throw createError({
      statusCode: 500,
      message: 'Something went wrong'
    });
  }
});
