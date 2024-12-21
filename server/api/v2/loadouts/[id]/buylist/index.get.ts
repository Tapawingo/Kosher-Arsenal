/** 
 * @file index.get.ts
 * @description API to Get current user's buylist for loadout
 * 
 * @route /api/v2/loadouts/:id/buylist
 * @method GET
 */

import { ArsenalBuylistSerialized } from "~/models/ArsenalBuylist.model";
import BuylistRepository from "~/server/repositories/buylist";

/**
 * API handler for getting loadouts by user.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event): Promise<ArsenalBuylistSerialized | null> => {
  const lucia = event.context.lucia;
  const buylistRepository = new BuylistRepository(event.context.db);
  
  const { user } = await validateSession(event.context.session, lucia);

  if (!event.context.params?.id) {
    throw createError({
      message: 'Missing loadout ID',
      statusCode: 400
    });
  }
  
  try {
    const loadoutId = event.context.params.id;
    return await buylistRepository.getByLoadout(user.id, loadoutId);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
