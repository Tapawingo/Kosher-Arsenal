/** 
 * @file index.get.ts
 * @description API to Get all buylists filtered by loadout or visibility (or both)
 * 
 * @route /api/v2/loadouts/:id/buylists
 * @method GET
 * 
 * @todo Not implemented
 */

import { ArsenalBuylistSerialized, ArsenalBuylistVisibility } from "~/models/ArsenalBuylist.model";
import BuylistRepository from "~/server/repositories/buylist";

/**
 * API handler for getting loadouts by user.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event): Promise<ArsenalBuylistSerialized[]> => {
  throw createError({
    statusCode: 501,
    message: 'Not implemented'
  });
});
