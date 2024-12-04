/** 
 * @file index.get.ts
 * @description API to Get all loadouts filtered by owner or visibility (or both)
 * 
 * @route /api/v2/loadouts/:id/categories
 * @method POST
 * 
 * @param limit amount of loadouts to get
 * @param offset index offset of loadouts to get (for pagination)
 * @param public "0" or "1". Filter in public loadouts (1 by default)
 * @param unlisted "0" or "1". Filter in unlisted loadouts (0 by default)
 * @param private "0" or "1". Filter in private loadouts (0 by default)
 */

import { ArsenalLoadoutSerialized, ArsenalLoadoutVisibility } from "~/models/ArsenalLoadout.model";
import LoadoutRepository from "~/server/repositories/loadout";
import { validateSession } from "~/server/utils/auth";

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
export default defineEventHandler(async (event): Promise<ArsenalLoadoutSerialized[]> => {
  const lucia = event.context.lucia;
  const loadoutRepository = new LoadoutRepository(event.context.db);
  const query = getQuery<IQuery>(event)
  
  const { user } = await validateSession(event.context.session, lucia);

  if (!event.context.params?.id) throw createError({
    message: 'Missing User ID',
    statusCode: 400
  });
  
  const userId = event.context.params.id;

  /* Verify access */
  const publicEnabled = !isNaN(parseInt(query.public)) ? parseInt(query.public) : 1;
  const unlistedEnabled = !isNaN(parseInt(query.unlisted)) ? parseInt(query.unlisted) : 0;
  const privateEnabled = !isNaN(parseInt(query.private)) ? parseInt(query.private) : 0;
  if (userId !== user.id && (unlistedEnabled || privateEnabled)) throw createError({
    message: 'Attempting to access unauthorized loadouts',
    statusCode: 403
  });
  
  try {
    const visibilities: ArsenalLoadoutVisibility[] = [];
    if (publicEnabled === 1) visibilities.push(ArsenalLoadoutVisibility.public);
    if (unlistedEnabled === 1) visibilities.push(ArsenalLoadoutVisibility.unlisted);
    if (privateEnabled === 1) visibilities.push(ArsenalLoadoutVisibility.private);

    const limit = !isNaN(parseInt(query.limit)) ? parseInt(query.limit) : 10;
    const offset = !isNaN(parseInt(query.offset)) ? parseInt(query.limit) : 0;
    
    return await loadoutRepository.getByUser(userId, limit, offset, visibilities);
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    });
  }
})
