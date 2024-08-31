import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutsTable } from '~/classes/ArsenalLoadout';

export default defineEventHandler(async (event): Promise<ArsenalLoadoutJson | null> => {
  const { id } = getRouterParams(event);

  const db = hubDatabase();
  const loadout = await db.prepare(`SELECT * FROM loadouts WHERE "id"="${ id }"`).first<LoadoutsTable>();

  if (!loadout) return loadout;

  const loadoutJson = new ArsenalLoadout().fromDB(loadout).toJSON();

  return loadoutJson;
})
