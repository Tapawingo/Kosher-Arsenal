import { ArsenalLoadout, ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { initializeDB, type DatabaseLoadout } from '~/server/utils/db';


export default defineEventHandler(async (event): Promise<ArsenalLoadoutJson | null> => {
  const db = initializeDB(hubDatabase());
  const { id } = getRouterParams(event);

  const loadout = await db.prepare(`SELECT * FROM loadouts WHERE "id"="${ id }"`).first<DatabaseLoadout>();

  if (!loadout) return loadout;

  const loadoutJson = new ArsenalLoadout().fromDB(loadout).toJSON();

  return loadoutJson;
})
