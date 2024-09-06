import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutVisibility } from '~/classes/ArsenalLoadout';

import type { DatabaseLoadout } from '~/server/utils/db';


export default defineEventHandler(async (event): Promise<ArsenalLoadoutJson | null> => {
  const db = event.context.db;
  const lucia = event.context.lucia;
  const { id } = getRouterParams(event);

  const loadout = await db.prepare(`SELECT * FROM loadouts WHERE "id"="${ id }"`).first<DatabaseLoadout>();

  if (!loadout) return loadout;

  const loadoutJson = new ArsenalLoadout().fromDB(loadout).toJSON();

  if (loadoutJson.visibility === LoadoutVisibility.private) {
    if (!event.context.session) {
      throw createError({
        message: 'Loadout is private',
        statusCode: 403
      });
    }
  
    const { session, user } = await lucia.validateSession(event.context.session.id);
    if (!session) {
      throw createError({
        message: 'Loadout is private',
        statusCode: 403
      });
    }

    if (user.id !== loadoutJson.owner) {
      throw createError({
        message: 'Loadout is private',
        statusCode: 403
      })
    }
  }

  return loadoutJson;
})
