import { ArsenalLoadout, ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { DatabaseLoadout } from '~/server/utils/loadoutDB';


export default defineEventHandler(async (event): Promise<ArsenalLoadoutJson | null> => {
  const db = hubDatabase();
  const { id } = getRouterParams(event);

  const loadout = await db.prepare(`SELECT * FROM loadouts WHERE "id"="${ id }"`).first<DatabaseLoadout>();

  if (!loadout) return loadout;

  const loadoutJson = new ArsenalLoadout().fromDB(loadout).toJSON();

  return loadoutJson;
})
