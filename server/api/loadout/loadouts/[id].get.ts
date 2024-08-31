import { ArsenalLoadout, ArsenalLoadoutJson, LoadoutsTable } from '~/classes/ArsenalLoadout';

export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const db = hubDatabase();
  const { id } = getRouterParams(event);

  const loadouts = await db.prepare('SELECT * FROM loadouts WHERE owner = ?')
  .bind(id).all<LoadoutsTable>();

  let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
  loadouts.results.forEach((loadout: LoadoutsTable) => {
    parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
  });

  return parsedLoadouts;
})
