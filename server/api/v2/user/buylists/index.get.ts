/** 
 * @file index.get.ts
 * @description API to Get all buylists owned by current user filtered by visibility
 * 
 * @route /api/v2/user/buylists
 * @method GET
 * 
 * @param limit amount of buylists to get
 * @param offset index offset of buylists to get (for pagination)
 * @param public "0" or "1". Filter in public buylists (1 by default)
 * @param unlisted "0" or "1". Filter in unlisted buylists (0 by default)
 * @param private "0" or "1". Filter in private buylists (0 by default)
 */

import { ArsenalBuylistSerialized, ArsenalBuylistVisibility } from "~/models/ArsenalBuylist.model";
import BuylistRepository from "~/server/repositories/buylist";

interface IQuery {
  limit: string;
  offset: string;
  public: '1' | '0';
  unlisted: '1' | '0';
  private: '1' | '0';
}

/**
 * API handler for getting loadouts by user.
 *
 * @param {H3Event} event - The incoming API event, including request, response, and context.
 */
export default defineEventHandler(async (event): Promise<ArsenalBuylistSerialized[]> => {
  const lucia = event.context.lucia;
  const buylistRepository = new BuylistRepository(event.context.db);
  const query = getQuery<IQuery>(event)
  
  const { user } = await validateSession(event.context.session, lucia);

  /* Verify access */
  const publicEnabled = !isNaN(parseInt(query.public)) ? parseInt(query.public) : 1;
  const unlistedEnabled = !isNaN(parseInt(query.unlisted)) ? parseInt(query.unlisted) : 0;
  const privateEnabled = !isNaN(parseInt(query.private)) ? parseInt(query.private) : 0;
  
  try {
    const visibilities: ArsenalBuylistVisibility[] = [];
    if (publicEnabled === 1) visibilities.push(ArsenalBuylistVisibility.public);
    if (unlistedEnabled === 1) visibilities.push(ArsenalBuylistVisibility.unlisted);
    if (privateEnabled === 1) visibilities.push(ArsenalBuylistVisibility.private);

    const limit = !isNaN(parseInt(query.limit)) ? parseInt(query.limit) : 10;
    const offset = !isNaN(parseInt(query.offset)) ? parseInt(query.limit) : 0;
    
    return await buylistRepository.getAllByUser(user.id, limit, offset, visibilities);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
});
