/** 
 * @file index.get.ts
 * @description API to Get item buylist for item
 * 
 * @route /api/v2/items/:id/buylist
 * @method GET
 */

import { ArsenalBuylistItemSerialized } from "~/models/ArsenalBuylistItem.model";
import BuylistRepository from "~/server/repositories/buylist";

/**
 * API handler for getting loadouts by user.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event): Promise<ArsenalBuylistItemSerialized | null> => {
  const lucia = event.context.lucia;
  const buylistRepository = new BuylistRepository(event.context.db);
  
  const { user } = await validateSession(event.context.session, lucia);

  if (!event.context.params?.id) {
    throw createError({
      message: 'Missing item ID',
      statusCode: 400
    });
  }
  
  try {
    const itemId = event.context.params.id;
    return await buylistRepository.getItemById(user.id, itemId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
