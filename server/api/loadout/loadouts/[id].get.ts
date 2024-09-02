import { ArsenalLoadout, ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
import { initializeDB, type DatabaseLoadout } from '~/server/utils/db';

export default defineEventHandler(async (event): Promise<Array<ArsenalLoadoutJson>> => {
  const db = initializeDB(hubDatabase());
  const { id } = getRouterParams(event);

  const loadouts = await db.prepare('SELECT * FROM loadouts WHERE owner = ?')
  .bind(id).all<DatabaseLoadout>();

  let parsedLoadouts: Array<ArsenalLoadoutJson> = [];
  loadouts.results.forEach((loadout: DatabaseLoadout) => {
    parsedLoadouts.push(new ArsenalLoadout().fromDB(loadout).toJSON());
  });

  return parsedLoadouts;
})
